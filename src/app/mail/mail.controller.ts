import { Body, Controller, HttpStatus, Post, Res } from '@nestjs/common';
import { MailService } from './mail.service';

@Controller('mails')
export class MailController {
    constructor(
        private readonly mailService: MailService,
    ) {
    }

    @Post('/verify')
    async verify(@Body() body, @Res() res): Promise<object> {
        await this.mailService.sendVerifyEmail(body.email);

        return res.status(HttpStatus.OK).json({ success: true }) ;
    }
}
