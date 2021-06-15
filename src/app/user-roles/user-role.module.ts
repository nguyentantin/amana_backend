import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserRole } from './dto/user-role.entity';
import { UserRoleService } from './user-role.service';
import { UserRoleRepository } from './user-role.repository';

@Module({
    imports: [
        TypeOrmModule.forFeature([UserRole, UserRoleRepository]),
    ],
    providers: [UserRoleService],
    exports: [UserRoleService],
})
export class UserRoleModule {}
