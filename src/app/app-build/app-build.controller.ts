import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Post,
    Query,
    Res,
} from '@nestjs/common';
import { AppLogger } from '../../core/logger';
import { TeamCityHookDto } from './dto/teamCityHook.dto';
import { AppBuildService } from './app-build.service';
import { AppBuild } from './dto/app-build.entity';
import { Auth } from '../../core/decorators/auth.decorator';
import { BuildConfigService } from '../build-config/build-config.service';
import { BuildConfig } from '../build-config/dto/build-config.entity';
import { SuperAuth } from '../../core/decorators/super-auth.decorator';
import { classToPlain } from 'class-transformer';
import { PlatFormType } from '../project/dto/project.entity';
import { ApiBearerAuth, ApiParam, ApiQuery, ApiTags } from '@nestjs/swagger';
import * as _ from 'lodash';
import { DownloadHistoryService } from '../download-history/download-history.service';
import { CreateDownloadHistoryInterface } from '../download-history/interface/create-download-history.interface';
import { AuthService } from '../auth/auth.service';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';
import { BaseController } from '../../core/constracts/base.controller';

@Controller('app-builds')
@ApiTags('App-Builds')
export class AppBuildController extends BaseController {
    private logger = new AppLogger(AppBuildController.name);

    constructor(
        private readonly appBuildService: AppBuildService,
        private readonly buildConfigService: BuildConfigService,
        private readonly downloadHistoryService: DownloadHistoryService,
    ) {
        super();
    }

    @Post('teamcity-hook')
    @HttpCode(HttpStatus.OK)
    async handleTeamcityHook(@Res() res, @Body() body: TeamCityHookDto): Promise<any> {
        await this.appBuildService.handleFromWebHook(body);
        return res.status(HttpStatus.OK).json();
    }

    @Get()
    @Auth()
    @ApiBearerAuth()
    async getRecent(@Query() query, @Res() res): Promise<object> {
        const data = await this.appBuildService.findAll(query, true);

        return res.status(HttpStatus.OK).json({
            code: HttpStatus.OK,
            status: 'OK',
            data: classToPlain(data),
        });
    }

    @Get('projects/:projectId')
    @Auth()
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'Project ID' })
    async listByProjectId(@Param('projectId') projectId: string, @Res() res) {
        const data = await this.appBuildService.listByProjectAndPaginate(Number(projectId));
        return this.responseOk(res, data);
    }

    @Get(':id/manifest.plist')
    async manifest(@Param() params, @Res() res): Promise<string> {
        // @TODO add policy for this app build id
        const { id } = params;
        const build = await this.appBuildService.findById(id);
        const { appName, s3Url, bundleId } = build;

        const plist = await this.appBuildService.generatePlistFile(bundleId, appName, s3Url);
        res.setHeader('Content-Type', 'text/plain');
        return res.send(plist);
    }

    @Get('configs')
    @SuperAuth()
    @ApiBearerAuth()
    async listAllConfig(): Promise<BuildConfig[]> {
        return await this.buildConfigService.listAllConfig();
    }

    @Get(':id/download.app')
    @Auth()
    @ApiBearerAuth()
    @ApiQuery({ name: 'token', description: 'Auth token' })
    @ApiParam({ name: 'id', description: 'Build ID' })
    async download(@Param() params, @Res() res): Promise<any> {
        const { id } = params;
        const build = await this.appBuildService.detail(id);
        const { project: { platformType } } = build;
        const buildObj = classToPlain(build);
        // Implement download history
        const user = AuthService.getAuthUser();
        const paramsHistory: CreateDownloadHistoryInterface = {
            appBuildId: id,
            userId: user.id,
        };
        await this.downloadHistoryService.create(paramsHistory);
        if ( platformType === PlatFormType.ANDROID ) {
            return res.status(HttpStatus.MOVED_PERMANENTLY).redirect(_.get(buildObj, 's3Url'));
        }
        const appUrl = process.env.APP_URL;
        const manifestUrl = `${appUrl}/app-builds/${id}/manifest.plist`;
        const iosUrl = `itms-services://?action=download-manifest&url=${manifestUrl}`;
        this.logger.log(`iosUrl = ${iosUrl}`);
        return res.status(HttpStatus.MOVED_PERMANENTLY).redirect(iosUrl);
    }

    @Get(':id/download-histories')
    @Auth()
    @ApiBearerAuth()
    async getDownloadHistories(@Param() params, @Res() res): Promise<any> {
        const { id } = params;
        const data = await this.downloadHistoryService.listByAppBuildId(id);

        return res.status(HttpStatus.OK)
            .json({
                status: 'OK',
                data: classToPlain(data),
            });
    }
}
