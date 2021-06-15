import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailController } from './mail.controller';
import { UserModule } from '../user/user.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VerifyEmail } from '../verify-email/dto/verify-email.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([VerifyEmail]),
        UserModule,
    ],
    controllers: [MailController],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {
}
