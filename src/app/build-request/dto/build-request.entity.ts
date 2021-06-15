import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';

@Entity({ name: 'build_requests' })
export class BuildRequest extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'project_id' })
    projectId: number;

    @Column({ name: 'author_id' })
    authorId: number;

    @Column({ length: 255 })
    title: string;

    @Column()
    status: string;

    @Column()
    description: string;
}
