import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';
import { Expose } from 'class-transformer';
import { S3Service } from '../../aws/s3.service';
import { AppLogger } from '../../../core/logger';
import { Controller, Provider } from '@nestjs/common';
import { Project } from '../../project/dto/project.entity';
import { DownloadHistory } from '../../download-history/dto/download-history.entity';

export enum BuildEnv {
    dev = 1,
    stg = 2,
    prod = 3,
}
@Entity({ name: 'app_builds' })
export class AppBuild extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'project_id' })
    projectId: number;

    @Column({ name: 'build_number' })
    buildNumber: number;

    @Column({ name: 'commit_changes' })
    commitChanges: string;

    @Column()
    version: string;

    @Column({ name: 's3_key' })
    s3Key: string;

    @Column({ name: 'bundle_id', nullable: true })
    bundleId: string;

    @Column({ name: 'app_name', nullable: true })
    appName: string;

    @Column({ name: 'filename' })
    filename: string;

    @Column({ name: 'env', type: 'enum', enum: BuildEnv, default: BuildEnv.dev })
    env: BuildEnv;

    @Column({ name: 'is_current', type: 'boolean', default: false })
    isCurrent: boolean;

    @Column({ name: 'download_count', type: 'int', default: 0 })
    downloadCount: number;

    @Expose()
    get s3Url(): string {
        const s3Service = new S3Service();
        return s3Service.getUrlByKey(this.s3Key);
    }

    @ManyToOne(type => Project, project => project.appBuilds)
    @JoinColumn({
        name: 'project_id', referencedColumnName: 'id',
    })
    project: Project;

    @OneToMany(() => DownloadHistory, history => history.appBuild)
    downloadHistories: DownloadHistory[];
}
