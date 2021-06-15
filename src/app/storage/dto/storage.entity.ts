import { Column, Entity, JoinColumn, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';
import { Project } from '../../project/dto/project.entity';

@Entity({ name: 'storage' })
export class Storage extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 's3_key' })
    s3Key: string;

    @Column({ name: 'is_temporary' })
    isTemporary: boolean;

    @Column({ name: 'storable_id'})
    storableId: number;

    @Column({ name: 'storable_type'})
    storableType: string;

    @Column({ name: 'entity_type' })
    entityType: number;

    @OneToOne(type => Project, project => project.avatar)
    @JoinColumn({
        name: 'storable_id',
        referencedColumnName: 'id',
    })
    project: Project;
}
