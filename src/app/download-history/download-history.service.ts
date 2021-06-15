import { Injectable } from '@nestjs/common';
import { CreateDownloadHistoryInterface } from './interface/create-download-history.interface';
import { DownloadHistory } from './dto/download-history.entity';
import { DownloadHistoryRepository } from './download-history.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { getNow } from '../../helpers';
import * as moment from 'moment';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';

@Injectable()
export class DownloadHistoryService {
    constructor(
        @InjectRepository(DownloadHistoryRepository)
        private readonly downloadHistoryRepo: DownloadHistoryRepository,
    ) {
    }

    async create(params: CreateDownloadHistoryInterface): Promise<DownloadHistory> {
        const created = this.downloadHistoryRepo.create(params);
        created.createdAt = moment().toDate();

        return await this.downloadHistoryRepo.save(created);
    }

    async listByAppBuildId(appBuildId: number|string): Promise<PaginationDto<DownloadHistory>> {
        return await this.downloadHistoryRepo.listByBuildId(appBuildId);
    }
}
