import { Body, Controller, Get, HttpCode, HttpStatus, Post, Query } from '@nestjs/common';
import {
    ApiBadRequestResponse,
    ApiInternalServerErrorResponse,
    ApiOkResponse,
    ApiTags,
    ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AuthService } from '../auth.service';
import { LoginDto } from '../dto/login.dto';
import { JwtDto } from '../dto/jwt.dto';
import { RegisterDto } from '../dto/register.dto';
import { AppLogger } from '../../../core/logger';
import { VerifyUserDto } from '../dto/verify-user.dto';
import { VerifyUserService } from '../../email-confirmation/services/verify-user.service';

@Controller('auth')
@ApiTags('Auth')
export class AuthController {
    private logger = new AppLogger(AuthController.name);
    constructor(
        private readonly authService: AuthService,
        private readonly verifyUserService: VerifyUserService,
    ) {}

    @Post('login')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'OK', type: JwtDto })
    @ApiBadRequestResponse({ description: 'validations error' })
    @ApiUnauthorizedResponse({ description: 'unauthorized' })
    public async login(@Body() loginDto: LoginDto): Promise<JwtDto> {
        const user = await this.authService.login(loginDto);
        return await this.authService.createAuthToken(user);
    }

    @Post('register')
    @HttpCode(HttpStatus.OK)
    public async register(@Body() registerDto: RegisterDto): Promise<any> {
        await this.authService.register(registerDto);

        return {
            success: true,
        };
    }

    @Get('active-user')
    @HttpCode(HttpStatus.OK)
    public async verifyUser(@Query() verifyUserDto: VerifyUserDto): Promise<object> {
        await this.verifyUserService.verifyUser(verifyUserDto);

        return {
            success: true,
        };
    }

    @Post('/google/authentication')
    @HttpCode(HttpStatus.OK)
    @ApiOkResponse({ description: 'OK', type: JwtDto })
    @ApiBadRequestResponse({ description: 'Email not belongs to neolab' })
    @ApiUnauthorizedResponse({ description: 'unauthorized' })
    @ApiInternalServerErrorResponse({ description: 'Wrong access token or google service expires'})
    public async googleAuthentication(@Body() { accessToken }): Promise<JwtDto> {
        const user = await this.authService.googleAuthentication(accessToken);
        return await this.authService.createAuthToken(user);
    }
}
