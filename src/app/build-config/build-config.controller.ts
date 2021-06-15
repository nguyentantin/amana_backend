import { Body, Controller, Get, HttpStatus, Param, Post, Put, Response, UseInterceptors } from '@nestjs/common';
import { Auth } from '../../core/decorators/auth.decorator';
import { RoleType } from '../../core/constants/role-type';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthInterceptor } from '../auth/auth.interceptor';
import { BuildConfigService } from './build-config.service';
import { CreateBuildConfigDto } from './dto/create-build-config.dto';
import { UpdateBuildConfigDto } from './dto/update-build-config.dto';

@Controller('projects/:id')
@ApiTags('Build-Config')
@UseInterceptors(AuthInterceptor)
@ApiBearerAuth()
export class BuildConfigController {

    constructor(private readonly buildConfigService: BuildConfigService) {
    }

    @Get('build-config')
    @Auth(RoleType.PROJECT_ADMIN)
    @ApiParam({ name: 'id', description: 'Project ID' })
    async listBuildConfig(@Param() params, @Response() res): Promise<any> {
        const projectId = params.id;
        const data = await this.buildConfigService.listByProject(projectId);

        return res.status(HttpStatus.OK)
            .json({
                data,
                status: 'OK',
            });
    }

    @Post('build-config')
    @Auth(RoleType.PROJECT_ADMIN)
    @ApiParam({ name: 'id', description: 'Project ID' })
    async createBuildConfig(@Param() params, @Body() body: CreateBuildConfigDto, @Response() res): Promise<any> {
        const projectId = params.id;
        const data = await this.buildConfigService.createConfig(projectId, body);

        return res.status(HttpStatus.OK)
            .json({
                data,
                status: 'OK',
            });
    }

    @Put('build-config')
    @Auth(RoleType.PROJECT_ADMIN)
    @ApiParam({ name: 'id', description: 'Project ID' })
    async updateBuildConfig(@Param() params, @Body() body: UpdateBuildConfigDto, @Response() res): Promise<any> {
        const projectId = params.id;
        const projectKey = body.projectKey;
        const data = await this.buildConfigService.updateConfig(projectId, projectKey, body);

        return res.status(HttpStatus.OK)
            .json({
                data,
                status: 'OK',
            });
    }
}
