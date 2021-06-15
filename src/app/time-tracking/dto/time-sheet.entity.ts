import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, ValueTransformer } from 'typeorm';
import { Model } from '../../../core/model';
import moment = require('moment');
import { NeoUser } from './neo-user.entity';

const transformDate: ValueTransformer = {
    from(value: any): any {
        return value ? moment(value).format('YYYY-MM-DD HH:mm:ss') : null;
    },
    to(value: any): any {
        return value;
    },
}

@Entity({ name: 'time_sheets' })
export class TimeSheet extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'neo_user_id' })
    neoUserId: number;

    @Column({
        name: 'checkin_at',
        type: 'timestamp',
        transformer: transformDate,
    })
    checkinAt: Date;

    @Column({
        name: 'checkout_at',
        type: 'timestamp',
        transformer: transformDate,
        default: null,
    })
    checkoutAt: Date;

    @ManyToOne(type => NeoUser, user => user.timeSheets)
    @JoinColumn({
        name: 'neo_user_id', referencedColumnName: 'id',
    })
    neoUser: NeoUser;
}
