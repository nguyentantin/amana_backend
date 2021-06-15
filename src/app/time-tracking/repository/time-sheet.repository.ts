import { EntityRepository, Repository } from 'typeorm';
import { TimeSheet } from '../dto/time-sheet.entity';
import moment = require('moment');

const DATE_FORMAT = 'YYYY-MM-DD';
const DATE_TIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

@EntityRepository(TimeSheet)
export class TimeSheetRepository extends Repository<TimeSheet> {
    async filter(options): Promise<TimeSheet[]> {
        const findOptions = {
            join: {
                alias: 'timeSheets',
                innerJoinAndSelect: {
                    neoUser: 'timeSheets.neoUser',
                },
            },
            where: (qb) => {
                if (options.username) {
                    qb.andWhere('neoUser.username LIKE :username', { username: `%${options.username}%`});
                }

                if (options.date) {
                    const date = moment(options.date).format(DATE_FORMAT);
                    qb.andWhere('DATE(timeSheets.createdAt) = :date', { date });
                }
            },
            order: {
                createdAt: 'DESC',
            },
        };

        // Type Script sida @@
        // @ts-ignore
        return await this.find(findOptions);
    }
}
