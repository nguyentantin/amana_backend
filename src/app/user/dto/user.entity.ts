import {
    Column,
    Entity,
    JoinColumn,
    ManyToMany,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn,
    getRepository,
} from 'typeorm';
import * as _ from 'lodash';

import { Model } from '../../../core/model';
import { Exclude, Expose } from 'class-transformer';
import { PasswordTransformer } from '../transformer/password.transformer';
import { Project } from '../../project/dto/project.entity';
import { UserProvider } from './user-provider.entity';
import { Role } from '../../role/dto/role.entity';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { UserRole } from '../../user-roles/dto/user-role.entity';
import { ColorTransformer } from '../../../core/transformer/color.transformer';
import { DownloadHistory } from '../../download-history/dto/download-history.entity';
import { Department } from '../../department/dto/department.entity';
import { RoleType } from '../../../core/constants/role-type';

@Entity({ name: 'users' })
export class User extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        unique: true,
    })
    email: string;

    @Column({
        type: 'varchar',
        transformer: new PasswordTransformer(),
        nullable: true,
    })
    @Exclude({ toPlainOnly: true })
    password: string;

    @Column({
        type: 'boolean',
        name: 'is_active',
    })
    isActive: boolean;

    @Column({
        type: 'boolean',
        name: 'is_default_password',
        default: false,
    })
    isDefaultPassword: boolean;

    @Column({
        name: 'color',
        transformer: new ColorTransformer(),
    })
    color: string;

    @Column({
        name: 'avatar_id',
    })
    avatarId: string;

    @Column({
        name: 'department_id',
    })
    departmentId: number;

    @Column({
        name: 'wc_username',
        type: 'varchar',
    })
    wcUsername: string;

    @Column({
        name: 'birthday',
        type: 'date',
    })
    birthday: Date;

    isSuperAdmin ?: boolean;

    @ManyToMany(() => Project, project => project.members)
    projects: Project[];

    @OneToMany(() => UserProvider, provider => provider.user)
    providers: UserProvider[];

    @ManyToMany(() => Role, role => role.users)
    roles: Role[];

    @OneToMany(() => UserRole, userRole => userRole.user)
    userRoles: UserRole[];

    @OneToMany(() => DownloadHistory, history => history.user)
    downloadHistories: DownloadHistory[];

    @ManyToOne(() => Department, department => department.members)
    @JoinColumn({
        name: 'department_id', referencedColumnName: 'id',
    })
    department: Department;

    async hasRole(roleName: string, projectId?: number): Promise<boolean> {
        if (isUndefined(projectId)) {
            let roles = this.roles;

            if (isUndefined(roles)) {
                roles = await getRepository(Role).createQueryBuilder('roles')
                    .innerJoin(
                        'roles.userRoles', 'userRoles',
                        'userRoles.memberId = :memberId', { memberId: this.id },
                    )
                    .where('roles.name = :roleName', { roleName })
                    .getMany();
            }

            /** Check { name: roleName } exists in array roles */
            return _.some(roles, { name: roleName });
        }

        const role = await getRepository(Role)
            .createQueryBuilder('roles')
            .innerJoin(
                'roles.userRoles',
                'userRoles',
                'userRoles.memberId = :memberId && userRoles.projectId = :projectId',
                { memberId: this.id, projectId },
            )
            .where('roles.name = :roleName', { roleName })
            .getOne();

        return !isUndefined(role);
    }

    async assignRole(roleId: number, projectId: number = null): Promise<any> {
        const userRoleRepo = getRepository(UserRole);
        const created = userRoleRepo.create({
            memberId: this.id,
            roleId,
            projectId,
        });

        return await userRoleRepo.save(created);
    }

    async removeRole(roleId: number, projectId: number = null): Promise<any> {
        const userRoleRepo = getRepository(UserRole);
        const userRole = await userRoleRepo.findOne({
            memberId: this.id,
            roleId,
            projectId,
        });

        return await userRoleRepo.remove(userRole);
    }

    canUpdateColumns() {
        return ['avatarId', 'color', 'name', 'password', 'departmentId', 'birthday'];
    }

    /** Trouble with isSuperAdmin here */
    @Expose()
    isAdmin(): any {
        if (_.isEmpty(this.roles)) {
            return false;
        }

        return _.some(this.roles, { name: RoleType.SUPER_ADMIN });
    }
}
