import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';
import { User } from '../../user/dto/user.entity';

@Entity({ name: 'departments' })
export class Department extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'name' })
    name: string;

    @Column({ name: 'description', length: 500 })
    description: string;

    @OneToMany(() => User, user => user.department)
    members: User[];

    static canUpdateColumns() {
        return ['name', 'description'];
    }
}
