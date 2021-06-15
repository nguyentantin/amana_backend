import {
    Body,
    Controller,
    Delete,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Put,
    Query,
    Response,
    UseInterceptors,
} from '@nestjs/common';
import { ProjectService } from '../project.service';
import { Project } from '../dto/project.entity';
import { CreateProjectDto } from '../dto/create-project.dto';
import { ProjectMemberDto } from '../dto/project-member.dto';
import { AssignProjectMemberDto } from '../dto/assign-project-member.dto';
import { Auth } from '../../../core/decorators/auth.decorator';
import { RoleType } from '../../../core/constants/role-type';
import { AppLogger } from '../../../core/logger';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';
import { AuthInterceptor } from '../../auth/auth.interceptor';
import { AuthService } from '../../auth/auth.service';
import { UserRoleService } from '../../user-roles/user-role.service';
import { AppBuildService } from '../../app-build/app-build.service';
import { ProjectAppBuildDetailDto } from '../dto/project-app-build-detail.dto';
import { filterByKeys } from '../../../helpers';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { StorageService } from '../../storage/storage.service';
import { UpdateProjectDto } from '../dto/update-project.dto';
import { BaseController } from '../../../core/constracts/base.controller';

@Controller('projects')
@ApiTags('Project')
@UseInterceptors(AuthInterceptor)
@ApiBearerAuth()
export class ProjectController extends BaseController {
    private logger = new AppLogger(ProjectController.name);

    constructor(
        private readonly projectService: ProjectService,
        private readonly userRoleService: UserRoleService,
        private readonly appBuildService: AppBuildService,
        private readonly storageService: StorageService,
    ) {
        super();
    }

    @Get()
    @Auth()
    async index(@Query('search') search): Promise<object> {
        const user = AuthService.getAuthUser();
        return await this.projectService.findProjectsByAuth(user, search);
    }

    @Get(':id')
    @Auth()
    @ApiParam({ name: 'id', description: 'Project ID' })
    async findOne(@Param('id') id: string, @Response() res): Promise<object> {
        const project = await this.projectService.findOneOrFail(Number(id));
        return this.responseOk(res, project);
    }

    @Post()
    @Auth()
    @HttpCode(HttpStatus.OK)
    create(@Body() createProjectDto: CreateProjectDto): Promise<Project> {
        const user = AuthService.getAuthUser();
        return this.projectService.create(createProjectDto, user.id);
    }

    @Post(':id/members')
    @Auth(RoleType.PROJECT_ADMIN)
    async assignMembers(@Param('id') id: string, @Body() data: AssignProjectMemberDto, @Response() res): Promise<object> {
        await this.userRoleService.assignMembers(id, data.members);
        return this.responseOk(res);
    }

    @Get('/:id/internal-members')
    @Auth()
    async internalMembers(@Param('id') id: string, @Response() res): Promise<object> {
        const members = await this.projectService.getInternalMembers(id);
        return this.responseOk(res, members);
    }

    @Get('/:id/external-members')
    @Auth()
    async externalMembers(@Param('id') id: string, @Response() res): Promise<object> {
        const users = await this.projectService.getExternalMembers(id);
        return this.responseOk(res, users);
    }

    @Get('/:id/app-builds/:appBuildId')
    @Auth()
    @ApiParam({ name: 'id', description: 'Project ID' })
    @ApiParam({ name: 'appBuildId', description: 'Build ID' })
    async getAppBuildDetail(@Param() params: ProjectAppBuildDetailDto, @Response() res): Promise<object> {
        const detail = await this.appBuildService.findDetail(params);
        return this.responseOk(res, detail);
    }

    @Put('/:id/member')
    @Auth(RoleType.PROJECT_ADMIN)
    async updateMemberRole(@Param('id') id: string, @Body() data: ProjectMemberDto, @Response() res): Promise<object> {
        await this.userRoleService.updateMember(id, data.memberId, data.roleId);
        return this.responseOk(res);
    }

    @Delete(':id/member/:memberId')
    @Auth(RoleType.PROJECT_ADMIN)
    async deleteMember(@Param() params, @Response() res): Promise<object> {
        await this.userRoleService.deleteMember(params.id, params.memberId);
        return this.responseOk(res);
    }

    @Put(':id')
    @Auth(RoleType.PROJECT_ADMIN)
    async update(@Param('id') id: string, @Body() data: UpdateProjectDto, @Response() res): Promise<object> {
        const updateData = filterByKeys(Project.canUpdateColumns(), data);

        if (!isUndefined(data.s3Key)) {
            await this.storageService.update(Number(id), Project.name, data.s3Key);
        }

        const project = await this.projectService.update(Number(id), updateData);

        return this.responseOk(res, project);
    }
}
