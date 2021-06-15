import { EntityRepository, Repository } from 'typeorm';
import { AppBuild } from './dto/app-build.entity';
import { AuthService } from '../auth/auth.service';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';

@EntityRepository(AppBuild)
export class AppBuildRepository extends Repository<AppBuild> {
    /**
     * Get list app build for authenticated user.
     *
     * @param {object} query
     * @param paginate boolean
     * @return {Promise<AppBuild[]>}
     */
    async getListAppBuildAuth(query, paginate = false): Promise<PaginationDto<AppBuild>|AppBuild[]> {
        const user = AuthService.getAuthUser();

        const queryBuilder = this.createQueryBuilder('appBuild')
            .leftJoinAndSelect('appBuild.project', 'project')
            .leftJoinAndSelect('project.avatar', 'avatar')
            .leftJoin('project.members', 'members')
            .andWhere('members.id = :authUserId', { authUserId: user.id })
            .orderBy({
                'appBuild.createdAt': 'DESC',
            });

        if (query.projectId) {
            queryBuilder.andWhere('project.id = :id', { id: query.projectId });
        }

        if (paginate) {
            return await queryBuilder.paginate();
        }
        return await queryBuilder.getMany();
    }

    /**
     * Get detail build for authenticated user.
     * @param {number|string} id
     * @return {Promise<AppBuild>}
     */
    async getDetailBuildAuth(id: number|string): Promise<AppBuild> {
        const user = AuthService.getAuthUser();

        return await this.createQueryBuilder('appBuild')
            .leftJoinAndSelect('appBuild.project', 'project')
            .leftJoin('project.members', 'members')
            .andWhere('appBuild.id = :id', { id })
            .andWhere('members.id = :authUserId', { authUserId: user.id })
            .orderBy({
                'appBuild.createdAt': 'DESC',
            })
            .getOne();
    }
}
