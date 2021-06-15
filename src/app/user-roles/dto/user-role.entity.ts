import { Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Role } from '../../role/dto/role.entity';
import { User } from '../../user/dto/user.entity';

@Entity('user_roles')
@Index(['projectId', 'memberId', 'roleId'], { unique: true })
export class UserRole {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('int', {
        name: 'project_id',
    })
    projectId: number;

    @Column('int', {
        name: 'member_id',
    })
    memberId: number;

    @Column('int', {
        name: 'role_id',
    })
    roleId: number;

    @ManyToOne(() => Role, role => role.userRoles)
    @JoinColumn({ name: 'role_id' })
    role: Role;

    @ManyToOne(() => User, user => user.userRoles)
    @JoinColumn({ name: 'member_id' })
    user: User;
}
