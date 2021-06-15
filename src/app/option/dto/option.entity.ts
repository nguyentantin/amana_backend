import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';

@Entity({ name: 'options' })
export class Option extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    key: string;

    @Column({ length: 255 })
    value: string;
}
