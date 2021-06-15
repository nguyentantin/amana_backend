import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query, Res } from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';
import { TimeTrackingDto } from './dto/time-tracking.dto';
import { TimeSheetType } from 'src/core/constants/timesheet-type';
import { TimeSheet } from './dto/time-sheet.entity';
import { SuperAuth } from '../../core/decorators/super-auth.decorator';
import { ApiTags } from '@nestjs/swagger';

@Controller('time-tracking')
@ApiTags('Time-Tracking')
export class TimeTrackingController {
    constructor(private readonly timeTrackingService: TimeTrackingService) {
    }

    @Get()
    @SuperAuth()
    async filterTimeSheet(@Query() query): Promise<TimeSheet[]> {
        return await this.timeTrackingService.findAll(query);
    }

    @Post()
    @HttpCode(HttpStatus.OK)
    async create(@Body() timeTrackingDto: TimeTrackingDto, @Res() res): Promise<any> {
        const { username } = timeTrackingDto;
        let msg = '';
        if (TimeSheetType.checkin === timeTrackingDto.type) {
            msg = await this.timeTrackingService.checkin(username);
        } else {
            msg = await this.timeTrackingService.checkout(username);
        }

        return res.status(HttpStatus.OK).json({ msg });
    }
}
