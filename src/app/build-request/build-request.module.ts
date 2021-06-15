import { Module } from '@nestjs/common';
import { BuildRequestController } from './build-request.controller';
import { BuildRequestService } from './build-request.service';

@Module({
  controllers: [BuildRequestController],
  providers: [BuildRequestService],
})
export class BuildRequestModule {}
