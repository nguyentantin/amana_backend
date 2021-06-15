import { Body, Controller, HttpCode, HttpStatus, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { AuthService } from '../../app/auth/auth.service';
import { LoginDto } from '../../app/auth/dto/login.dto';
import { JwtDto } from '../../app/auth/dto/jwt.dto';
import { AppLogger } from '../../core/logger';
import { RoleType } from '../../core/constants/role-type';

@Controller('admin/auth')
@ApiTags('Auth-Admin')
export class AuthAdminController {
    private logger = new AppLogger(AuthAdminController.name);
    constructor(
        private readonly authService: AuthService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    // @ApiOkResponse({ description: 'OK', type: JwtDto })
    // @ApiBadRequestResponse({ description: 'validations error' })
    // @ApiUnauthorizedResponse({ description: 'unauthorized' })
    public async login(@Body() loginDto: LoginDto): Promise<JwtDto> {
        const user = await this.authService.login(loginDto, RoleType.SUPER_ADMIN);
        return await this.authService.createAuthToken(user);
    }
}
