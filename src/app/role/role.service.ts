import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Role } from './dto/role.entity';
import { RoleRepository } from './role.repository';
import { Equal, Not } from 'typeorm';
import { RoleType } from '../../core/constants/role-type';

@Injectable()
export class RoleService {
    constructor(@InjectRepository(Role) private readonly roleRepo: RoleRepository) {
    }

    async getRoles(userId, projectId, roleNames): Promise<Role[]> {
        return await this.roleRepo.createQueryBuilder('roles')
            .innerJoin(
                'roles.userRoles',
                'userRoles',
                'userRoles.memberId = :userId && userRoles.projectId = :projectId',
                {userId, projectId},
            )
            .where('roles.name IN (:...roleNames)', {roleNames})
            .getMany();
    }

    async all(): Promise<Role[]> {
        return await this.roleRepo.find({
            where: [
                {name: Not(Equal(RoleType.SUPER_ADMIN))},
            ],
        });
    }

    async getRoleIdByName(name: string): Promise<number> {
        const finder = await this.roleRepo.findOne({ where: { name } });

        return finder.id;
    }

    async getRoleById(id: number): Promise<Role> {
        return await this.roleRepo.findOne(id);
    }
}
