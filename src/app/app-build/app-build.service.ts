import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../core/logger';
import { Repository } from 'typeorm';
import { AppBuild, BuildEnv } from './dto/app-build.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { TeamCityHookDto } from './dto/teamCityHook.dto';
import { Project } from '../project/dto/project.entity';
import { S3Service } from '../aws/s3.service';
import { isEmpty, isNil, isUndefined } from '@nestjs/common/utils/shared.utils';
import { PLATFORM_TYPE } from '../../helpers';
import * as _ from 'lodash';
import { CreateAppBuildDto } from './dto/createAppBuild.dto';
import { BuildOutputInterface } from './interface/buildOutput.interface';
import * as path from 'path';
import * as plist from 'plist';
import { classToPlain } from 'class-transformer';
import { ResourceNotFoundException } from '../../exceptions/resource-not-found.exception';
import { ProjectAppBuildDetailDto } from '../project/dto/project-app-build-detail.dto';
import { NotifyService } from '../notify/notify.service';
import { AppBuildRepository } from './app-build.repository';
import { AuthService } from '../auth/auth.service';
import * as moment from 'moment';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';

@Injectable()
export class AppBuildService {
    private logger = new AppLogger(AppBuildService.name);

    constructor(
        @InjectRepository(AppBuild)
        private readonly appBuildRepo: AppBuildRepository,
        @InjectRepository(Project)
        private readonly projectRepo: Repository<Project>,
        private readonly s3Service: S3Service,
        private readonly notifyService: NotifyService,
    ) {
    }

    async handleFromWebHook(params: TeamCityHookDto): Promise<any> {
        const { build } = params;
        const { buildResult, buildId, buildTypeId, projectId, changes, buildNumber, projectName, teamcityProperties } = build;
        const pathStore = `${projectId}/${buildTypeId}/${buildId}`;

        if ('failure' === buildResult) {
            return false;
        }
        try {
            const project = await this.projectRepo.findOne({ where: { name: projectName } });
            if (!isUndefined(project)) {
                const listFiles = await this.s3Service.listFileInDir(pathStore);
                const buildOutput = await this.getBuildVersionFromListFile(listFiles.Contents, project.platformType);
                const commitChanges = await this.getCommitChanges(changes);
                const env = this.getEnvParams(teamcityProperties);
                this.logger.log(`env => ${env}`);
                const paramsBuild = {
                    version: buildOutput.version,
                    commitChanges,
                    projectId: project.id,
                    s3Key: buildOutput.s3Key,
                    buildNumber,
                    filename: buildOutput.filename,
                    env: BuildEnv[env],
                    bundleId: buildOutput.bundleId,
                    appName: buildOutput.appName,
                };

                this.logger.debug(`Created app build version => ${JSON.stringify(paramsBuild)}`);

                await this.createAppBuildVersion(paramsBuild, projectName);
            } else {
                this.logger.warn(`Project name [${projectName}] not found`);
            }
            return true;
        } catch (e) {
            this.logger.error(e);
        }
    }

    async getBuildVersionFromListFile(listFiles, platformType: string): Promise<BuildOutputInterface> {
        /**
         * Is Android type
         */
        if (PLATFORM_TYPE.android === platformType) {
            // Only get object file with '.json' extension
            const outputFile = _.find(listFiles, (item) => {
                return _.endsWith(item.Key, '.json');
            });
            const apkFile = _.find(listFiles, (item) => {
                return _.endsWith(item.Key, '.apk');
            });
            if (!isUndefined(outputFile)) {
                const fileJson = await this.s3Service.fileJsonGetContent(outputFile.Key);
                const firstJson = _.head(fileJson);
                return {
                    s3Key: apkFile.Key,
                    version: _.get(firstJson, 'apkData.versionName', null),
                    filename: _.get(firstJson, 'apkData.outputFile', null),
                };
            }
        } else {
            /**
             * Is Ios type
             */
            const outputFile = _.find(listFiles, (item) => {
                return _.endsWith(item.Key, 'Info.plist');
            });
            const ipaFile = _.find(listFiles, (item) => {
                return _.endsWith(item.Key, '.ipa');
            });

            if (!isUndefined(outputFile)) {
                const fileJson = await this.s3Service.filePlistGetContent(outputFile.Key);
                const plistJson = JSON.parse(fileJson);
                const bundleId = _.get(plistJson, 'plist.dict.dict.string[1]', null);
                const version = _.get(plistJson, 'plist.dict.dict.string[2]', null);
                const appName = _.get(plistJson, 'plist.dict.string[0]', null);

                return {
                    s3Key: ipaFile.Key,
                    version,
                    filename: path.basename(ipaFile.Key),
                    bundleId,
                    appName,
                };
            }
        }
    }

    async createAppBuildVersion(createDto: CreateAppBuildDto, projectName?: string): Promise<any> {
        const { buildNumber, version, projectId } = createDto;
        const build = await this.appBuildRepo.findOne({ where: { buildNumber, version, projectId } });

        if (isNil(build)) {
            const create = this.appBuildRepo.create(createDto);
            create.createdAt = moment().toDate();

            const buildCreated = await this.appBuildRepo.save(create);
            const paramNotify = {
                projectId: createDto.projectId,
                commitChanges: createDto.commitChanges,
                buildId: buildCreated.id,
                projectName,
                version,
            };
            await this.notifyService.sendNotifyWorkChat(paramNotify);
            return buildCreated;
        } else {
            return await this.appBuildRepo.update(build.id, createDto);
        }
    }

    async getCommitChanges(changes): Promise<string> {
        let result = '';
        changes.forEach((item) => {
            result += `${_.get(item, 'change.comment', null)} - by [${_.get(item, 'change.username', null)}]`;
        });

        if (isEmpty(result)) {
            result = 'No changes';
        }
        return result;
    }

    getEnvParams(teamcityProperties: object[]): string {
        const envProperty = _.find(teamcityProperties, { name: 'env' });

        return _.get(envProperty, 'value', null);
    }

    async generatePlistFile(bundleId: string, appName: string, ipaUrl: string): Promise<string> {
        const data = {
            items: [
                {
                    assets: [
                        {
                            kind: 'software-package',
                            url: ipaUrl,
                        },
                    ],
                    metadata: {
                        'bundle-identifier': bundleId,
                        'bundle-version': '1.0',
                        'kind': 'software',
                        'title': appName,
                    },
                },
            ],
        };

        return plist.build(data);
    }

    async findAll(query, paginate = false): Promise<PaginationDto<AppBuild>|AppBuild[]> {
        return this.appBuildRepo.getListAppBuildAuth(query, paginate);
    }

    async detail(id: number | string): Promise<AppBuild> {
        const build = await this.appBuildRepo.getDetailBuildAuth(id);
        if ( isUndefined(build) ) {
            throw new ResourceNotFoundException();
        }
        return build;
    }

    async findById(id: number): Promise<any> {
        const query = {
            where: { id },
        };

        return await this.findOne(query);
    }

    /**
     * Find detail of appBuild
     * @param params ProjectAppBuildDetailDto
     * @throws ResourceNotFoundException
     * @return object
     */
    async findDetail(params: ProjectAppBuildDetailDto): Promise<object> {
        const user = AuthService.getAuthUser();

        const appBuild = await this.appBuildRepo.createQueryBuilder('appBuilds')
            .leftJoinAndSelect('appBuilds.project', 'project')
            .leftJoinAndSelect('project.author', 'author')
            .leftJoin('project.members', 'members')
            .andWhere('project.id = :id', { id: params.id })
            .andWhere('appBuilds.id = :appBuildId', { appBuildId: params.appBuildId })
            .andWhere('members.id = :authUserId', { authUserId: user.id })
            .getOne();

        if (!appBuild) {
            throw new ResourceNotFoundException();
        }

        // @TODO: must remove s3Key
        return classToPlain(appBuild); // trigger exclude password
    }

    async getCurrentVersion(projectId: number): Promise<any> {
        // @TODO: Add current version
        /** Get the highest app build version */
        const query = {
            where: {
                projectId,
            },
            order: {
                id: 'DESC',
            },
        };

        return await this.findOne(query);
    }

    async findOne(query): Promise<any> {
        const appBuild = await this.appBuildRepo.findOne(query);

        // if (isUndefined(appBuild)) {
        //     throw new ResourceNotFoundException();
        // }

        return classToPlain(appBuild);
    }

    async listByProjectAndPaginate(projectId: number): Promise<PaginationDto<AppBuild>> {
        const appBuild = this.appBuildRepo
            .createQueryBuilder()
            .where('project_id = :projectId', {projectId})
            .orderBy({created_at: 'DESC'});

        return await appBuild.paginate();
    }
}
