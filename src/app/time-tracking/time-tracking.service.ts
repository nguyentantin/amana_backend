import { Injectable } from '@nestjs/common';
import { AppLogger } from '../../core/logger';
import { NeoUser } from './dto/neo-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { QueryBuilder, Repository } from 'typeorm';
import * as moment from 'moment-timezone';
import * as _ from 'lodash';
import { TimeSheet } from './dto/time-sheet.entity';
import { isNil } from '@nestjs/common/utils/shared.utils';
import { getNow } from '../../helpers';
import { TimeSheetRepository } from './repository/time-sheet.repository';

@Injectable()
export class TimeTrackingService {
    private logger = new AppLogger(TimeTrackingService.name);

    constructor(
        @InjectRepository(NeoUser)
        private readonly userRepo: Repository<NeoUser>,
        @InjectRepository(TimeSheet)
        private readonly timeSheetRepo: TimeSheetRepository,
    ) {
    }

    /**
     * Find all time sheet with neoUser
     * @param query
     * @return Promise<TimeSheet[]>
     */
    async findAll(query): Promise<TimeSheet[]> {
        return await this.timeSheetRepo.filter(query);
    }

    async checkin(username: string): Promise<string> {
        this.logger.debug(`checkin [${username}]`);
        const user = await this.updateOrCreatNeoUser(username);
        const todayTimeSheet = await this.getTodayCheckin(user.username);
        this.logger.log(todayTimeSheet);

        if (isNil(todayTimeSheet)) {
            const timeSheet = this.timeSheetRepo.create();
            timeSheet.neoUserId = user.id;
            timeSheet.checkinAt = getNow();
            await this.timeSheetRepo.save(timeSheet);
            return 'Thank you!! You are checked in! Have a nice working day. :*';
        }

        return 'You have already checked in!!';
    }

    async checkout(username: string): Promise<string> {
        this.logger.debug(`checkout [${username}]`);
        const todayTimeSheet = await this.getTodayCheckin(username);

        if (isNil(todayTimeSheet)) {
            return 'Ah ha! Please checkin before checkout';
        }

        const checkinAt = _.get(todayTimeSheet, 'checkin_at', null);
        const checkoutAt = _.get(todayTimeSheet, 'checkout_at', null);
        const worked = moment.duration( moment(new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})).diff(checkinAt)).asHours();
        const hours = Number(worked).toFixed(1);
        this.logger.log(`hours => ${hours}`);
        if (!isNil(checkoutAt)) {
            return 'Opp!!! You have already checked out!!';
        }

        const timeSheetId = _.get(todayTimeSheet, 'id');
        const updated = await this.timeSheetRepo.update(timeSheetId, { checkoutAt: getNow() });
        this.logger.log(todayTimeSheet);

        return `You worked ${hours} hours, Thank you for a hard working day!!`;

    }

    async getTodayCheckin(username: string): Promise<any> {
        const now = moment(new Date().toLocaleString('vi-VN', {timeZone: 'Asia/Ho_Chi_Minh'})).format('YYYY-MM-DD');
        return await this.timeSheetRepo.createQueryBuilder('timeTracking')
            .select('timeTracking.*')
            .addSelect('neoUser.username', 'username')
            .innerJoin('neo_users', 'neoUser', 'timeTracking.neoUserId = neoUser.id')
            .where('DATE(timeTracking.checkinAt) = DATE(:now)', { now })
            .andWhere('neoUser.username = :username', { username })
            .getRawOne();
    }

    async updateOrCreatNeoUser(username: string) {
        let user = await this.userRepo.findOne({ where: { username } });
        if (!user) {
            user = this.userRepo.create();
            user.username = username;
            await this.userRepo.save(user);
        }

        return user;
    }
}
