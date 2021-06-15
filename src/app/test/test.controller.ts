import { Body, Controller, forwardRef, Get, Inject, Post, Req, Res } from '@nestjs/common';
import { AppLogger } from '../../core/logger';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { S3Service } from '../aws/s3.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('test')
@ApiTags('Test')
export class TestController {
    private logger = new AppLogger(TestController.name);

    constructor(private readonly s3Service: S3Service) {
    }

    @Post()
    async index(@Body() params, @Res() res): Promise<any> {
        this.logger.log('test route');
        const data = 'test controller';
        this.logger.debug(params);
        this.logger.log('data => ' + isUndefined(data));
        return res.status(200).json([]);
    }

    @Get()
    async getTest(@Body() params, @Res() res): Promise<any> {
        this.logger.log('test route');

        try {
            const listFiles = await this.s3Service.getUrlByKey('SucoIos/SucoIos_SucoIosDev/236/SuCo.ipa');
            this.logger.log(listFiles);
        } catch (e) {
            this.logger.log(e);
        }
        this.logger.log('DONE');

        // this.logger.log(`list file => ${JSON.stringify(listFiles)}`);

        return res.status(200).json([]);
    }
}
