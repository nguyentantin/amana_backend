import { Module } from '@nestjs/common';
import { ProjectAdminController } from './project-admin.controller';
import { ProjectAdminService } from './project-admin.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Project } from '../../app/project/dto/project.entity';
import { ProjectAdminRepository } from './project-admin.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([Project, ProjectAdminRepository]),
  ],
  controllers: [ProjectAdminController],
  providers: [ProjectAdminService],
})
export class ProjectAdminModule {}
