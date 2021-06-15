import { Module } from '@nestjs/common';
import { AuthAdminController } from './auth-admin.controller';

@Module({
    controllers: [AuthAdminController],
})
export class AuthAdminModule {}
