import { BadRequestException, Injectable } from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import * as randomColor from 'randomcolor';

import { UserService } from '../../app/user/user.service';
import { RoleService } from '../../app/role/role.service';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';
import { User } from '../../app/user/dto/user.entity';
import { UserNotFoundException } from '../../exceptions/auth/user-not-found.exception';
import { AlreadyActiveUserException } from '../../exceptions/auth/already-active-user.exception';
import { InactiveUserException } from '../../exceptions/auth/inactive-user.exception';
import { CreateUserDto } from './dto/create-user.dto';
import Common from '../../helpers/common';
import { InviteUserService } from '../../app/email-confirmation/services/invite-user.service';

@Injectable()
export class UserAdminService {
    constructor(
        private readonly userService: UserService,
        private readonly roleService: RoleService,
        private readonly inviteUserService: InviteUserService,
    ) {
    }

    /**
     * Get list user with pagination.
     * @return {Promise<PaginationDto<User>>}
     */
    async getListUser(): Promise<PaginationDto<User>> {
        return await this.userService.paginateUser();
    }

    /**
     * Get list user with roles
     * @return {Promise<PaginationDto<User>>}
     */
    async getListUserWithRoles(): Promise<PaginationDto<User>> {
        return await this.userService.getListUserWithRoles();
    }

    /**
     * Create user and send an email.
     * @return {Promise<User>}
     */
    async createUser(createUserDto: CreateUserDto): Promise<User> {
        const password = Common.generateRandomString(8);
        const userData = {
            ...createUserDto,
            password,
            color: randomColor(),
            isDefaultPassword: true,
        };
        const user = await this.userService.create(userData);

        if (createUserDto.isActive) {
            /** Only send mail when user active */
            await this.inviteUserService.run(user.email, { password });
        }

        return user;
    }

    /**
     * Active user.
     * @return {Promise<boolean>>}
     */
    async activeUser(userId: string): Promise<boolean> {
        const user = await this.userService.findOneById(userId);

        if (isUndefined(user)) {
            throw new UserNotFoundException();
        }

        if (user.isActive) {
            throw new AlreadyActiveUserException();
        }

        user.isActive = true;
        await this.userService.saveUser(user);

        return true;
    }

    /**
     * Disable user.
     * @return {Promise<boolean>>}
     */
    async disableUser(userId): Promise<boolean> {
        const user = await this.userService.findOneById(userId);

        if (isUndefined(user)) {
            throw new UserNotFoundException();
        }

        if (!user.isActive) {
            throw new InactiveUserException('already_inactive_user');
        }

        user.isActive = false;
        await this.userService.saveUser(user);

        return true;
    }

    async assignRole(userId, roleId: number): Promise<any> {
        const user = await this.userService.findOneById(userId);

        if (isUndefined(user)) {
            throw new UserNotFoundException();
        }

        const role = await this.roleService.getRoleById(roleId);

        if (isUndefined(role)) {
            throw new BadRequestException('Role not found');
        }

        if (await user.hasRole(role.name)) {
            throw new BadRequestException('Can not assign this role, you have already this role');
        }

        await user.assignRole(roleId);
        return true;
    }

    async removeRole(userId, roleId: number): Promise<any> {
        const user = await this.userService.findOneById(userId);

        if (isUndefined(user)) {
            throw new UserNotFoundException();
        }

        const role = await this.roleService.getRoleById(roleId);

        if (isUndefined(role)) {
            throw new BadRequestException('Role not found');
        }

        const roleExist = await user.hasRole(role.name);
        if (!roleExist) {
            throw new BadRequestException('User is not assigned this role');
        }

        await user.removeRole(roleId);
        return true;
    }

    async updateWcUsername(userId: number, wcUsername: string) {
        return await this.userService.updateProfile(userId, { wcUsername });
    }
}
