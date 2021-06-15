import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';
import { Project } from '../../project/dto/project.entity';
import { User } from './user.entity';

export enum ProviderType {
    FACEBOOK = 'facebook',
    GOOGLE = 'google',
    GITHUB = 'github',
}

@Entity({ name: 'user_providers' })
export class UserProvider extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        type: 'int',
        name: 'user_id',
    })
    userId: string;

    @Column({
        type: 'enum',
        enum: ProviderType,
    })
    type: ProviderType;

    @Column({
        type: 'varchar',
        name: 'provider_id',
    })
    providerId: string;

    @ManyToOne(type => User, user => user.providers)
    @JoinColumn({
        name: 'user_id', referencedColumnName: 'id',
    })
    user: User;
}
