import { Module } from '@nestjs/common';
import { ProjectController } from './controller/project.controller';
import { ProjectService } from './project.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProjectRepository } from './project.repository';
import { Project } from './dto/project.entity';
import { AppBuildModule } from '../app-build/app-build.module';
import { UserRoleModule } from '../user-roles/user-role.module';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
      TypeOrmModule.forFeature([Project, ProjectRepository]),
      AppBuildModule, UserRoleModule, StorageModule,
  ],
  controllers: [ProjectController],
  providers: [ProjectService],
  exports: [ProjectService],
})
export class ProjectModule {}
