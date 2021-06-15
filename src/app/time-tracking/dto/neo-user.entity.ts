import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';
import { TimeSheet } from './time-sheet.entity';

@Entity({ name: 'neo_users' })
export class NeoUser extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    username: string;

    @Column({ length: 255, nullable: true })
    fullname: string;

    @Column({ length: 255, nullable: true })
    email: string;

    @OneToMany(type => TimeSheet, timeSheet => timeSheet.neoUser)
    timeSheets: TimeSheet[];
}
