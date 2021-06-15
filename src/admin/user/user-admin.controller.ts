import { Body, Controller, Delete, Get, Param, Post, Put, Res } from '@nestjs/common';
import { ApiBearerAuth, ApiParam, ApiTags } from '@nestjs/swagger';

import { CreateUserDto } from './dto/create-user.dto';
import { SuperAuth } from '../../core/decorators/super-auth.decorator';
import { UserAdminService } from './user-admin.service';
import { BaseController } from '../../core/constracts/base.controller';
import { UpdateWcUsernameDto } from './dto/update-wc-username.dto';

@Controller('admin/users')
@ApiTags('User-Admin')
export class UserAdminController extends BaseController {
    constructor(
        private readonly adminService: UserAdminService,
    ) {
        super();
    }

    @Get()
    @SuperAuth()
    @ApiBearerAuth()
    async listUser(@Res() res): Promise<object> {
        const userData = await this.adminService.getListUserWithRoles();
        return this.responseOk(res, userData);
    }

    @Post()
    @SuperAuth()
    @ApiBearerAuth()
    async createUser(@Body() createUserDto: CreateUserDto, @Res() res): Promise<object> {
        const user = await this.adminService.createUser(createUserDto);
        return this.responseOk(res, user);
    }

    @Post('active/:id')
    @SuperAuth()
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'User id'})
    async activeUser(@Param('id') id: string, @Res() res): Promise<object> {
        const status = await this.adminService.activeUser(id);
        return this.responseOk(res, status);
    }

    @Post('disable/:id')
    @SuperAuth()
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'User id'})
    async disableUser(@Param('id') id: string, @Res() res): Promise<object> {
        const status = await this.adminService.disableUser(id);
        return this.responseOk(res, status);
    }

    @Put(':id/roles/')
    @SuperAuth()
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'User id'})
    @ApiParam({ name: 'roleId', description: 'Role id'})
    async assignRoles(@Param('id') id: number, @Body('roleId') roleId: number, @Res() res): Promise<object> {
        const status = await this.adminService.assignRole(id, roleId);
        return this.responseOk(res, status);
    }

    @Delete(':id/roles/:roleId')
    @SuperAuth()
    @ApiBearerAuth()
    @ApiParam({ name: 'id', description: 'User id'})
    @ApiParam({ name: 'roleId', description: 'Role id'})
    async removeRoles(@Param('id') id: number, @Param('roleId') roleId: number, @Res() res): Promise<object> {
        const status = await this.adminService.removeRole(id, roleId);
        return this.responseOk(res, status);
    }

    @Put(':id')
    async updateWcUsername(@Param('id') id: number, @Body() data: UpdateWcUsernameDto, @Res() res) {
        const user = this.adminService.updateWcUsername(Number(id), data.wcUsername);
        return this.responseOk(res, user);
    }
}
