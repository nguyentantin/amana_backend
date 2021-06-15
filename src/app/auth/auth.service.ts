import { BadRequestException, ForbiddenException, Injectable } from '@nestjs/common';
import * as randomColor from 'randomcolor';

import { UserService } from '../user/user.service';
import { JwtPayload } from './interfaces/jwt-payload.inferface';
import { User } from '../user/dto/user.entity';
import { AppLogger } from '../../core/logger';
import { JwtDto } from './dto/jwt.dto';
import { LoginDto } from './dto/login.dto';
import { BcryptHash, formatDate, getUsernameFromEmail } from '../../helpers';
import JwtService from './jwt/jwt.service';
import { InactiveUserException } from '../../exceptions/auth/inactive-user.exception';
import { UserNotFoundException } from '../../exceptions/auth/user-not-found.exception';
import { PasswordNotMatchException } from '../../exceptions/auth/password-not-match.exception';
import { ContextService } from '../../core/providers/context.service';
import { GoogleService } from './social/google.service';
import { NeolabEmailRegex } from '../../core/constants/neolab-email-regex';
import { ProviderType } from '../user/dto/user-provider.entity';
import { RoleType } from '../../core/constants/role-type';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { VerifyUserService } from '../email-confirmation/services/verify-user.service';
import { DeepPartial } from 'typeorm';

@Injectable()
export class AuthService {
    private logger = new AppLogger(AuthService.name);
    private static AUTH_USER_KEY = 'user_key';

    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
        private readonly verifyUserService: VerifyUserService,
        private readonly googleService: GoogleService,
    ) {
    }

    async login(loginDto: LoginDto, roleName?: string): Promise<any> {
        const user = await this.userService.findByEmail(loginDto.email);

        if (!user) {
            throw new UserNotFoundException();
        }

        if (!user.isActive) {
            throw new InactiveUserException();
        }

        if (!BcryptHash.compareHash(loginDto.password, user.password)) {
            throw new PasswordNotMatchException();
        }

        if (!isUndefined(roleName)) {
            const hasPermission = await user.hasRole(roleName);
            if (!hasPermission) {
                throw new ForbiddenException();
            }
        }

        return user;
    }

    async register(data: DeepPartial<User>): Promise<User> {
        data.birthday = formatDate(data.birthday);
        data.wcUsername = getUsernameFromEmail(data.email);

        const user = await this.userService.create({
            ...data,
            color: randomColor(),
        });

        await this.verifyUserService.run(user.email);

        return user;
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        return await this.userService.findOneById(payload.id);
    }

    async createAuthToken(user: User): Promise<JwtDto> {
        user.isSuperAdmin = await user.hasRole(RoleType.SUPER_ADMIN);

        return this.jwtService.createAuthToken(user);
    }

    static setAuthUser(user: User) {
        ContextService.set(AuthService.AUTH_USER_KEY, user);
    }

    static getAuthUser(): User {
        return ContextService.get(AuthService.AUTH_USER_KEY);
    }

    async googleAuthentication(accessToken: string): Promise<any> {
        const tokenInfo = await this.googleService.getTokenInfo(accessToken);

        /** Check email belong to NeoLab */
        if (!NeolabEmailRegex.test(tokenInfo.email)) {
            throw new BadRequestException('Email must be belong to NeoLab', 'email_not_belong_to_neo_lab');
        }

        let user = await this.userService.findByEmail(tokenInfo.email);
        const userProvider = await this.userService.findProvider({
            providerId: tokenInfo.providerId,
            type: ProviderType.GOOGLE,
        });

        if (!user) {
            /** Create user */
            user = await this.userService.create({
                name: tokenInfo.name,
                email: tokenInfo.email,
                isActive: true,
                color: randomColor(),
            });
        }

        if (!userProvider) {
            /** Create user provider */
            await this.userService.createProvider({
                user,
                type: ProviderType.GOOGLE,
                providerId: tokenInfo.providerId,
            });
        }

        return user;
    }
}
