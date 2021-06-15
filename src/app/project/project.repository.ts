import { EntityRepository, Repository } from 'typeorm';
import { Project } from './dto/project.entity';
import { User } from '../user/dto/user.entity';
import { AuthService } from '../auth/auth.service';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { Inject } from '@nestjs/common';
import { AppBuildService } from '../app-build/app-build.service';

@EntityRepository(Project)
export class ProjectRepository extends Repository<Project> {
    @Inject(AppBuildService) appBuildService: AppBuildService;

    /**
     * Find One project with its relations
     *
     * @param {string|number} projectId
     * @return {Promise<Project>}
     */
    async findOneProject(projectId: string|number): Promise<Project> {
        const user = AuthService.getAuthUser();

        return await this.createQueryBuilder('project')
            .leftJoinAndSelect('project.author', 'author')
            .leftJoinAndSelect('project.avatar', 'avatar',
                'avatar.storable_id = project.id AND avatar.storable_type= :type', { type: Project.name }) // Polymorphic
            .leftJoin('project.members', 'members')
            .andWhere('project.id = :id', { id: projectId })
            .andWhere('members.id = :authUserId', { authUserId: user.id })
            .getOne();
    }

    async getListProjectsAuth(user: User, search?: string): Promise<Project[]> {
        const queryBuilder = this.createQueryBuilder('project')
            .leftJoinAndSelect('project.author', 'author')
            .leftJoinAndSelect('project.members', 'members')
            .leftJoinAndSelect('project.avatar', 'avatar',
                'avatar.storable_id = project.id AND avatar.storable_type= :type', { type: Project.name }) // Polymorphic
            .leftJoinAndMapOne('project.latestAppBuild', 'project.appBuilds', 'appBuilds')
            .loadRelationCountAndMap('project.totalAppBuilds', 'project.appBuilds')
            .where('members.id = :authUserId', { authUserId: user.id })
            .orderBy({
                'appBuilds.createdAt': 'DESC',
            });

        if (!isUndefined(search)) {
            const sql = 'project.name like :search OR project.description like :search';
            const params = { search: `%${search}%` };
            queryBuilder.andWhere(sql, params);
        }

        return await queryBuilder.getMany();
    }
}
