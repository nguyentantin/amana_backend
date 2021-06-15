import { Module } from '@nestjs/common';
import { BuildConfigService } from './build-config.service';
import { BuildConfigController } from './build-config.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildConfig } from './dto/build-config.entity';
import { BuildConfigRepository } from './build-config.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([BuildConfig, BuildConfigRepository]),
  ],
  providers: [BuildConfigService],
  exports: [BuildConfigService],
  controllers: [BuildConfigController],
})
export class BuildConfigModule {}
