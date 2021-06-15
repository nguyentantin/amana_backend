import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Project } from './dto/project.entity';
import { ProjectRepository } from './project.repository';
import { isEmpty, isUndefined } from '@nestjs/common/utils/shared.utils';
import { classToPlain } from 'class-transformer';
import { ResourceNotFoundException } from '../../exceptions/resource-not-found.exception';
import { AppBuildService } from '../app-build/app-build.service';
import { User } from '../user/dto/user.entity';
import { UserRepository } from '../user/user.repository';
import { In, Not } from 'typeorm';
import { CreateProjectDto } from './dto/create-project.dto';
import { AppLogger } from '../../core/logger';
import { RoleType } from '../../core/constants/role-type';
import { StorageService } from '../storage/storage.service';
import { ProjectMemberDto } from './dto/project-member.dto';
import { UserRoleService } from '../user-roles/user-role.service';
import { RoleService } from '../role/role.service';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class ProjectService {
    private logger = new AppLogger(ProjectService.name);

    constructor(
        @InjectRepository(ProjectRepository) private readonly projectRepo: ProjectRepository,
        @InjectRepository(UserRepository) private readonly userRepo: UserRepository,
        private readonly appBuildService: AppBuildService,
        private readonly userRoleService: UserRoleService,
        private readonly roleService: RoleService,
        private readonly storageService: StorageService,
    ) {
    }

    /**
     * Find one project with author or fail
     * @param projectId: number
     * @return {object}
     */
    async findOneOrFail(projectId: number): Promise<object> {
        const project = await this.projectRepo.findOneProject(projectId);
        const appBuilds = await this.appBuildService.listByProjectAndPaginate(Number(projectId));

        const user = AuthService.getAuthUser();
        const isProjectManager = await user.hasRole(RoleType.PROJECT_ADMIN, projectId);

        if (isUndefined(project)) {
            throw new ResourceNotFoundException();
        }

        const currentVersion = await this.appBuildService.getCurrentVersion(project.id);

        return {
            project: {
                ...classToPlain(project),
                isProjectManager,
            },
            appBuilds,
            currentVersion: isUndefined(currentVersion) ? null : currentVersion,
        };
    }

    async create(dto: CreateProjectDto, authorId: number): Promise<Project> {
        const project = this.projectRepo.create(dto);
        project.authorId = authorId;
        await this.projectRepo.save(project);

        if (dto.storageKey) {
            await this.storageService.moveFileStorage(project.id, dto.storageKey);
        }

        const roleId = await this.roleService.getRoleIdByName(RoleType.PROJECT_ADMIN);
        const projectOwner: ProjectMemberDto = { memberId: authorId, roleId };
        await this.userRoleService.assignMembers(project.id, [projectOwner]);

        return project;
    }

    async getExternalMembers(id: string): Promise<object> {
        const internalMembers = await this.getInternalMembers(id);
        let users;

        if (isEmpty(internalMembers)) {
            users = await this.userRepo.find();
        } else {
            const memberIds = internalMembers.map(member => member.id);

            users = await this.userRepo.find({
                where: {
                    id: Not(In(memberIds)),
                },
            });
        }

        return classToPlain(users);
    }

    async findProjectsByAuth(user: User, search: string): Promise<any> {
        const projects = await this.projectRepo.getListProjectsAuth(user, search);

        return classToPlain(projects);
    }

    async getInternalMembers(id: string): Promise<any[]> {
        const userRoles = await this.userRoleService.getDataByProjectId(id);

        return userRoles.map(userRole => ({
            ...userRole.user,
            role: {
                ...userRole.role,
            },
        }));
    }

    async update(id: number, data: ProjectInterface): Promise<object> {
        await this.projectRepo.update(id, data);
        return await this.findOneOrFail(id);
    }
}
