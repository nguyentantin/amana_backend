import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRole } from './dto/user-role.entity';
import { getConnection, Repository } from 'typeorm';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

@Injectable()
export class UserRoleService {
    constructor(@InjectRepository(UserRole) private readonly repo: Repository<UserRole>) {
    }

    async assignMembers(projectId, memberData): Promise<boolean> {
        const data = memberData.map(member => {
            return {
                ...member,
                projectId: Number(projectId),
            };
        });

        if (isEmpty(data)) {
            return false;
        }

        const query = this.repo
            .createQueryBuilder()
            .insert()
            .values(data);

        const [sql, args] = query.getQueryAndParameters();
        const newSql = sql.replace('INSERT INTO', 'INSERT IGNORE INTO');

        await getConnection().transaction(async manager => {
            await manager.query(newSql, args);
        });

        return true;
    }

    async deleteMember(projectId, memberId): Promise<void> {
        await this.repo.createQueryBuilder()
            .delete()
            .where('project_id = :projectId', { projectId })
            .andWhere('member_id = :memberId', { memberId })
            .execute();
    }

    async updateMember(projectId, memberId, roleId) {
        await this.repo.update({ projectId, memberId }, { roleId });
    }

    async getDataByProjectId(projectId) {
        return await this.repo.find({
            relations: ['role', 'user'],
            where: { projectId },
        });
    }
}
