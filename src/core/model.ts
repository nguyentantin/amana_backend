import {
    BaseEntity,
    CreateDateColumn,
    UpdateDateColumn,
    ValueTransformer,
} from 'typeorm';
import moment = require('moment');

const transformDate: ValueTransformer = {
    from(value: any): any {
        return moment(value).format('YYYY-MM-DD HH:mm:ss');
    },
    to(value: any): any {
        return value;
    },
};

export class Model extends BaseEntity {
    @CreateDateColumn({
        name: 'created_at',
        type: 'timestamp',
        transformer: transformDate,
    })
    createdAt: Date;

    @UpdateDateColumn({
        name: 'updated_at',
        type: 'timestamp',
        transformer: transformDate,
    })
    updatedAt: Date;
}
