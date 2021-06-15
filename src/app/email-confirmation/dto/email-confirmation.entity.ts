import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';

export enum ConfirmationType {
    RESET_PASSWORD = 'password',
    REGISTER = 'register',
    VERIFY_USER = 'verify_user',
}

export enum StatusType {
    UNCONFIRMED,
    CONFIRMED,
}

@Entity({ name: 'email_confirmations' })
export class EmailConfirmation extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 50 })
    type: ConfirmationType;

    @Column({ length: 255 })
    token: string;

    @Column({
        name: 'expired_at',
        type: 'timestamp',
    })
    expiredAt: Date;

    @Column()
    status: StatusType;
}
