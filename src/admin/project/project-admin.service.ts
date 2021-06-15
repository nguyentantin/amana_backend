import { Injectable } from '@nestjs/common';
import { ProjectAdminRepository } from './project-admin.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';
import { Project } from '../../app/project/dto/project.entity';

@Injectable()
export class ProjectAdminService {
    constructor(
        @InjectRepository(ProjectAdminRepository)
        private readonly projectAdminRepo: ProjectAdminRepository,
    ) {
    }

    async filterProjects(): Promise<PaginationDto<Project>> {
        return await this.projectAdminRepo.listProjects();
    }
}
