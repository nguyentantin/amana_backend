import { Module } from '@nestjs/common';
import { ProjectSettingController } from './project-setting.controller';
import { ProjectSettingService } from './project-setting.service';

@Module({
  controllers: [ProjectSettingController],
  providers: [ProjectSettingService],
})
export class ProjectSettingModule {}
