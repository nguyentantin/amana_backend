import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';
import { User } from '../../user/dto/user.entity';
import { AppBuild } from '../../app-build/dto/app-build.entity';

@Entity({ name: 'download_histories' })
export class DownloadHistory extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'app_build_id',
    })
    appBuildId: number;

    @Column({
        name: 'user_id',
    })
    userId: number;

    @ManyToOne(() => User, user => user)
    @JoinColumn({
        name: 'user_id', referencedColumnName: 'id',
    })
    user: User;

    @ManyToOne(() => AppBuild, build => build)
    @JoinColumn({
        name: 'app_build_id', referencedColumnName: 'id',
    })
    appBuild: AppBuild;
}
