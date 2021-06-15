import { EntityRepository, Repository } from 'typeorm';
import { ProjectSetting } from './dto/project-setting.entity';

@EntityRepository(ProjectSetting)
export class ProjectRepository extends Repository<ProjectSetting> {
}
