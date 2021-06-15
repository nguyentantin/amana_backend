import { Module } from '@nestjs/common';
import { TimeTrackingService } from './time-tracking.service';
import { TimeTrackingController } from './time-tracking.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NeoUser } from './dto/neo-user.entity';
import { TimeSheet } from './dto/time-sheet.entity';
import { TimeSheetRepository } from './repository/time-sheet.repository';

@Module({
  imports: [
    TypeOrmModule.forFeature([NeoUser, TimeSheet, TimeSheetRepository]),
  ],
  providers: [TimeTrackingService],
  controllers: [TimeTrackingController],
})
export class TimeTrackingModule {}
