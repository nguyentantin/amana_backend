import { Global, Module } from '@nestjs/common';
import { PasswordController } from './password.controller';
import { EmailConfirmationModule } from '../email-confirmation/email-confirmation.module';
import { PasswordService } from './password.service';

@Global()
@Module({
    imports: [
        EmailConfirmationModule,
    ],
    providers: [
        PasswordService,
    ],
    controllers: [PasswordController],
    exports: [
        PasswordService,
    ],
})
export class PasswordModule {}
