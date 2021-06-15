import { Global, Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../../config/jwt.config';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './controller/auth.controller';
import { UserModule } from '../user/user.module';
import JwtService from './jwt/jwt.service';
import { MailModule } from '../mail/mail.module';
import { GoogleService } from './social/google.service';
import { EmailConfirmationModule } from '../email-confirmation/email-confirmation.module';

@Global()
@Module({
    imports: [
        UserModule,
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60m' },
        }),
        MailModule,
        EmailConfirmationModule,
    ],
    providers: [
        AuthService,
        JwtStrategy,
        JwtService,
        GoogleService,
    ],
    controllers: [AuthController],
    exports: [
        PassportModule.register({ defaultStrategy: 'jwt' }),
        JwtModule.register({
            secret: jwtConstants.secret,
            signOptions: { expiresIn: '60m' },
        }),
        AuthService,
        JwtStrategy,
        JwtService,
        GoogleService,
    ],
})
export class AuthModule {}
