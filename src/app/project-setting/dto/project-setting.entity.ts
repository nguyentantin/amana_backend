import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';

@Entity({ name: 'project_settings' })
export class ProjectSetting extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    name: string;

    @Column({ length: 255 })
    value: string;

    @Column({ name: 'project_id' })
    authorId: number;
}
