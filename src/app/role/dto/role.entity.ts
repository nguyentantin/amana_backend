import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { UserRole } from '../../user-roles/dto/user-role.entity';
import { User } from '../../user/dto/user.entity';

@Entity('roles')
export class Role {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'varchar',
        unique: true,
    })
    name: string;

    @Column({
        type: 'text',
    })
    description: string;

    @OneToMany(() => UserRole, userRole => userRole.role)
    userRoles: UserRole[];

    @ManyToMany(() => User, user => user.roles)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'role_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'member_id',
            referencedColumnName: 'id',
        },
    })
    users: User[];
}
