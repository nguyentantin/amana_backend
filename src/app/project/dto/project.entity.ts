import {
    Column,
    Entity,
    PrimaryGeneratedColumn,
    OneToMany,
    ManyToMany,
    JoinTable,
    OneToOne,
    JoinColumn,
} from 'typeorm';
import { Model } from '../../../core/model';
import { AppBuild } from '../../app-build/dto/app-build.entity';
import { User } from '../../user/dto/user.entity';
import { BuildConfig } from '../../build-config/dto/build-config.entity';
import { Storage } from '../../storage/dto/storage.entity';
import { Transform } from 'class-transformer';
import { S3Service } from '../../aws/s3.service';
import { ColorTransformer } from '../../../core/transformer/color.transformer';

export enum PlatFormType {
    IOS = 'ios',
    ANDROID = 'android',
    WEB = 'web',
}

@Entity({ name: 'projects' })
export class Project extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column()
    description: string;

    @Column({ name: 'author_id' })
    authorId: number;

    @Column({ name: 'platform_type' })
    platformType: string;

    @Column({
        name: 'color',
        transformer: new ColorTransformer(),
    })
    color: string;

    @OneToMany(() => AppBuild, appBuild => appBuild.project)
    appBuilds: AppBuild[];

    @ManyToMany(() => User, user => user.projects)
    @JoinTable({
        name: 'user_roles',
        joinColumn: {
            name: 'project_id',
            referencedColumnName: 'id',
        },
        inverseJoinColumn: {
            name: 'member_id',
            referencedColumnName: 'id',
        },
    })
    members: User[];

    @OneToOne(() => User)
    @JoinColumn({
        name: 'author_id', referencedColumnName: 'id',
    })
    author: User;

    @OneToMany(() => BuildConfig, buildConfig => buildConfig.project)
    buildConfigurations: BuildConfig[];

    @OneToOne(() => Storage, avatar => avatar.project)
    @Transform(avatar => {
        const s3Service = new S3Service();
        return avatar ? s3Service.getUrlByKey(avatar.s3Key) : null;
    })
    avatar: Storage;

    static canUpdateColumns() {
        return ['name', 'description', 'platformType', 'color'];
    }
}
