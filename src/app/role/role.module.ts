import { Global, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Role } from './dto/role.entity';
import { RoleRepository } from './role.repository';
import { RoleController } from './role.controller';
import { RoleService } from './role.service';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
    imports: [TypeOrmModule.forFeature([Role, RoleRepository])],
    controllers: [RoleController],
    providers: [RoleService, RolesGuard],
    exports: [RoleService, RolesGuard],
})
export class RoleModule {}
