import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { EmailConfirmationController } from './email-confirmation.controller';
import { EmailConfirmation } from './dto/email-confirmation.entity';
import { EmailConfirmationSubscriber } from './email-confirmation.subscriber';
import { EmailConfirmationRepository } from './email-confirmation.repository';
import { UserService } from '../user/user.service';
import { ResetPasswordService } from './services/reset-password.service';
import { VerifyUserService } from './services/verify-user.service';
import { InviteUserService } from './services/invite-user.service';

@Module({
    imports: [
        TypeOrmModule.forFeature([EmailConfirmation, EmailConfirmationRepository]),
        UserService,
    ],
    providers: [ResetPasswordService, EmailConfirmationSubscriber, VerifyUserService, InviteUserService],
    controllers: [EmailConfirmationController],
    exports: [
        TypeOrmModule.forFeature([EmailConfirmation, EmailConfirmationRepository]),
        ResetPasswordService, VerifyUserService, InviteUserService,
    ],
})
export class EmailConfirmationModule {
}
