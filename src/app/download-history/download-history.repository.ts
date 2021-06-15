import { EntityRepository, Repository } from 'typeorm';
import { DownloadHistory } from './dto/download-history.entity';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';

@EntityRepository(DownloadHistory)
export class DownloadHistoryRepository extends Repository<DownloadHistory> {
    async listByBuildId(appBuildId: number | string): Promise<PaginationDto<DownloadHistory>> {
        return await this.createQueryBuilder('download')
            .leftJoinAndSelect('download.user', 'user')
            .where('download.appBuildId = :appBuildId', { appBuildId })
            .orderBy({
                'download.createdAt': 'DESC',
            })
            .paginate();
    }
}
