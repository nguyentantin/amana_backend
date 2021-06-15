import { Global, Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './dto/user.entity';
import { UserRepository } from './user.repository';
import { VerifyEmail } from '../verify-email/dto/verify-email.entity';
import { UserProvider } from './dto/user-provider.entity';

@Global()
@Module({
    imports: [
        TypeOrmModule.forFeature([User, UserRepository, VerifyEmail, UserProvider]),
    ],
    controllers: [UserController],
    providers: [UserService],
    exports: [
        UserService,
        TypeOrmModule.forFeature([User, UserRepository, VerifyEmail]),
    ],
})
export class UserModule {
}
