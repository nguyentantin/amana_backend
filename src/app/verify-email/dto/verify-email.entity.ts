import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { Model } from '../../../core/model';

@Entity({ name: 'verify_emails' })
export class VerifyEmail extends Model {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 255 })
    token: string;

    @Column({
        name: 'expired_at',
        type: 'timestamp',
    })
    expiredAt: Date;
}
