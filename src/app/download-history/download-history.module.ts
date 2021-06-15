import { Module } from '@nestjs/common';
import { DownloadHistoryService } from './download-history.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DownloadHistory } from './dto/download-history.entity';
import { DownloadHistoryRepository } from './download-history.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([DownloadHistory, DownloadHistoryRepository]),
    ],
    providers: [DownloadHistoryService],
    exports: [DownloadHistoryService],
})
export class DownloadHistoryModule {
}
