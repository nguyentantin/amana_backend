import { Controller, Get, HttpStatus, Response, UseInterceptors } from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { AuthInterceptor } from '../../app/auth/auth.interceptor';
import { SuperAuth } from '../../core/decorators/super-auth.decorator';
import { AppLogger } from '../../core/logger';
import { ProjectAdminService } from './project-admin.service';

@Controller('admin/projects')
@ApiTags('Project-Admin')
@UseInterceptors(AuthInterceptor)
@ApiBearerAuth()
@SuperAuth()
export class ProjectAdminController {
    private logger = new AppLogger(ProjectAdminController.name);

    constructor(
        private readonly projectAdminService: ProjectAdminService,
    ) {
    }

    @Get()
    async index(@Response() res): Promise<object> {
        const data = await this.projectAdminService.filterProjects();

        return res.status(HttpStatus.OK)
            .json(data);
    }
}
