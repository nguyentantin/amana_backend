import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../core/logger';
import { BuildConfigRepository } from './build-config.repository';
import { CreateBuildConfigDto } from './dto/create-build-config.dto';
import { BuildConfigInterface } from './interface/build-config.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { BuildConfig } from './dto/build-config.entity';
import { UpdateBuildConfigDto } from './dto/update-build-config.dto';
import * as _ from 'lodash';

@Injectable()
export class BuildConfigService {
    private logger = new AppLogger(BuildConfigService.name);

    constructor(@InjectRepository(BuildConfigRepository) private readonly buildConfigRepo: BuildConfigRepository) {
    }

    async listByProject(projectId: number): Promise<BuildConfig[]> {
        return await this.buildConfigRepo.find({ where: { projectId } });
    }

    async createConfig(projectId: number, params: CreateBuildConfigDto): Promise<BuildConfig> {
        const jsonValue = _.pick(params, ['teamCityToken', 'env']);
        const data: BuildConfigInterface = {
            projectId,
            projectKey: params.projectKey,
            jsonValue,
        };

        const created = this.buildConfigRepo.create(data);

        return await this.buildConfigRepo.save(created);
    }

    async updateConfig(projectId: number, projectKey: string, params: UpdateBuildConfigDto): Promise<BuildConfig> {
        const jsonValue = _.pick(params, ['teamCityToken', 'env']);

        const config = await this.buildConfigRepo.findOne({ where: { projectId, projectKey } });

        config.jsonValue = jsonValue;
        return await config.save();
    }

    async listAllConfig(): Promise<BuildConfig[]> {
        return await this.buildConfigRepo.find();
    }
}
