import {
    Body,
    ClassSerializerInterceptor,
    Controller,
    Get,
    HttpStatus,
    Put,
    Query,
    Request, Response,
    UseInterceptors,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

import { UserService } from './user.service';
import { User } from './dto/user.entity';
import { AppLogger } from '../../core/logger';
import { Auth } from '../../core/decorators/auth.decorator';
import { AuthService } from '../auth/auth.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { filterByKeys } from '../../helpers';
import { RoleType } from '../../core/constants/role-type';
import { BaseController } from '../../core/constracts/base.controller';

@Controller('users')
@ApiTags('User')
export class UserController extends BaseController {
    private logger = new AppLogger(UserController.name);

    constructor(private readonly usersService: UserService) {
        super();
    }

    @Get()
    @UseInterceptors(ClassSerializerInterceptor)
    index(@Query('search') search: string): Promise<User[]> {
        return this.usersService.findAll(search);
    }

    @Get('me')
    @Auth()
    @ApiBearerAuth()
    @UseInterceptors(ClassSerializerInterceptor)
    async me(@Request() req): Promise<User> {
        const user = AuthService.getAuthUser();
        user.isSuperAdmin = await user.hasRole(RoleType.SUPER_ADMIN);
        return user;
    }

    @Put('me')
    @Auth()
    @ApiBearerAuth()
    async updateProfile(@Body() data: UpdateUserDto, @Response() res): Promise<object> {
        const user = AuthService.getAuthUser();
        const updateData = filterByKeys(user.canUpdateColumns(), data);

        const auth = await this.usersService.updateProfile(Number(user.id), {
            ...updateData,
            isDefaultPassword: false,
        });

        return this.responseOk(res, auth);
    }
}
