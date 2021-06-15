import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { StorageController } from './storage.controller';
import { StorageService } from './storage.service';
import { AwsModule } from '../aws/aws.module';
import { Storage } from './dto/storage.entity';
import { StorageRepository } from './storage.repository';

@Module({
  imports: [
      TypeOrmModule.forFeature([Storage, StorageRepository]),
      AwsModule,
  ],
  controllers: [StorageController],
  providers: [StorageService],
  exports: [StorageService],
})
export class StorageModule {}
