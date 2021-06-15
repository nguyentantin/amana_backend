import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';
import { Project } from '../../project/dto/project.entity';
import { JsonValueTransformer } from '../transformer/json-value.transformer';

@Entity({ name: 'build_configurations' })
export class BuildConfig extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({
        name: 'project_id',
    })
    projectId: number;

    @Column({
        name: 'project_key',
    })
    projectKey: string;

    @Column({
        type: 'json',
        name: 'json_value',
        transformer: new JsonValueTransformer(),
    })
    jsonValue: string|object;

    @ManyToOne(type => Project, project => project.buildConfigurations)
    @JoinColumn({
        name: 'project_id', referencedColumnName: 'id',
    })
    project: Project;
}
