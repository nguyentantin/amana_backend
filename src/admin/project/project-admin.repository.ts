import { EntityRepository, Repository } from 'typeorm';
import { Project } from '../../app/project/dto/project.entity';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';

@EntityRepository(Project)
export class ProjectAdminRepository extends Repository<Project> {
    async listProjects(): Promise<PaginationDto<Project>> {
        const finder = this.createQueryBuilder('project')
            .leftJoinAndSelect('project.author', 'author')
            .leftJoinAndSelect('project.members', 'members')
            .leftJoinAndSelect('project.avatar', 'avatar',
                'avatar.storable_id = project.id AND avatar.storable_type= :type', { type: Project.name }) // Polymorphic
            .orderBy({
                'project.createdAt': 'DESC',
            });

        return await finder.paginate();
    }
}
