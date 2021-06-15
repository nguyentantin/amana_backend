import { Body, Controller, HttpCode, HttpStatus, Post, Response } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { EmailConfirmationService } from '../email-confirmation/services/email-confirmation.service';
import { AppLogger } from '../../core/logger';
import { PasswordConfirmationDto } from '../email-confirmation/dto/password-confirmation.dto';
import { ConfirmationType } from '../email-confirmation/dto/email-confirmation.entity';
import { ResetPasswordService } from '../email-confirmation/services/reset-password.service';
import { RateLimit } from '../../core/rate-limiter';

@Controller('pwd')
@ApiTags('Password')
export class PasswordController {
    private logger = new AppLogger(PasswordController.name);

    constructor(
        private readonly resetPasswordService: ResetPasswordService,
    ) {
    }

    @Post('send-mail')
    @HttpCode(HttpStatus.OK)
    @RateLimit({ points: 3, duration: 3600 }) /** 3 times per hour */
    public async sendMail(@Body() forgotPasswordDto: ForgotPasswordDto, @Response() res): Promise<object> {
        const status = await this.resetPasswordService.run(forgotPasswordDto.email);

        return res.json({
            success: true,
        });
    }

    @Post('reset')
    @HttpCode(HttpStatus.OK)
    async reset(@Body() passwordConfirmDto: PasswordConfirmationDto, @Response() res): Promise<any> {
        await this.resetPasswordService.verifyPassword(passwordConfirmDto);

        return res.status(HttpStatus.OK).json({ success: true });
    }
}
