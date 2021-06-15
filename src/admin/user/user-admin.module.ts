import { Module } from '@nestjs/common';
import { UserModule } from '../../app/user/user.module';
import { UserAdminController } from './user-admin.controller';
import { UserAdminService } from './user-admin.service';
import { EmailConfirmationModule } from '../../app/email-confirmation/email-confirmation.module';

@Module({
    imports: [
        UserModule, EmailConfirmationModule,
    ],
    controllers: [UserAdminController],
    providers: [UserAdminService],
    exports: [UserAdminService],
})
export class UserAdminModule {
}
