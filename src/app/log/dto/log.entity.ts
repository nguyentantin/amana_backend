import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';

@Entity({ name: 'logs' })
export class Log extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    content: string;

    @Column({ name: 'build_id' })
    buildId: string;
}
