import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial, Like, Repository } from 'typeorm';
import * as _ from 'lodash';

import { User } from './dto/user.entity';
import { AppLogger } from '../../core/logger';
import { CreateUserDto } from './dto/create-user.dto';
import { RegisterDto } from '../auth/dto/register.dto';
import { UserNotFoundException } from '../../exceptions/auth/user-not-found.exception';
import { VerifyEmail } from '../verify-email/dto/verify-email.entity';
import { UserProvider } from './dto/user-provider.entity';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { PaginationDto } from '../../core/pagination/dto/pagination.dto';
import { formatDate } from '../../helpers';

@Injectable()
export class UserService {
    private logger = new AppLogger(UserService.name);

    constructor(
        @InjectRepository(User)
        private readonly usersRepo: Repository<User>,
        @InjectRepository(UserProvider)
        private readonly userProviderRepo: Repository<UserProvider>,
        @InjectRepository(VerifyEmail)
        private readonly verifyEmailRepo: Repository<VerifyEmail>,
    ) {
    }

    async findAll(search: string): Promise<User[]> {
        let options;

        if (isUndefined(search)) {
            options = {
                isActive: true,
            };
        } else {
            options = {
                where: [
                    { email: Like(`%${search}%`), isActive: true },
                    { name: Like(`%${search}%`), isActive: true },
                ],
            };
        }

        options = {
            ...options,
            skip: 0,
            take: 10,
        };

        return await this.usersRepo.find(options);
    }

    async create(userData: CreateUserDto|RegisterDto|object): Promise<User> {
        const user = this.usersRepo.create(userData);
        return await this.usersRepo.save(user);
    }

    async createProvider(providerData: object): Promise<UserProvider> {
        const userProvider = this.userProviderRepo.create(providerData);
        return await this.userProviderRepo.save(userProvider);
    }

    async findByEmail(em: string): Promise<User> {
        this.logger.debug(`findByEmail: ${em}`);
        return await this.usersRepo.findOne({ email: em });
    }

    async findProvider(conditions: object): Promise<UserProvider> {
        return await this.userProviderRepo.findOne(conditions);
    }

    async findOneById(id: string): Promise<User|undefined> {
        this.logger.debug(`Find auth with id = ${id}`);
        return await this.usersRepo.findOne(id, { relations: ['roles'] });
    }

    async updateProfile(id: number, data: DeepPartial<User>): Promise<any> {
        if (_.has(data, 'birthday')) {
            data.birthday = formatDate(data.birthday);
        }

        await this.usersRepo.update(id, data);
        return await this.usersRepo.findOne(id);
    }

    /**
     * Save user from user instance.
     * @param {User} user
     * @return {User}
     */
    async saveUser(user: User): Promise<User> {
        return await this.usersRepo.save(user);
    }

    /**
     * Get all user with pagination.
     * @return {Promise<PaginationDto<User>>}
     */
    async paginateUser(): Promise<PaginationDto<User>> {
        return await this.usersRepo.createQueryBuilder('user')
            .orderBy('user.createdAt', 'DESC')
            .paginate();
    }

    /**
     * Find user by email or throw exception if user not found.
     * @param {string} email
     * @throws {UserNotFoundException}
     * @return {Promise<User>}
     */
    async findUserByEmailOrFail(email: string): Promise<User> {
        const user = this.findByEmail(email);

        if (isUndefined(user)) {
            throw new UserNotFoundException();
        }

        return user;
    }

    /**
     * Paginate all user with roles.
     * @return {Promise<PaginationDto<User>>}
     */
    async getListUserWithRoles(): Promise<PaginationDto<User>> {
        return await this.usersRepo.createQueryBuilder('user')
            .leftJoinAndSelect('user.roles', 'roles')
            .orderBy('user.createdAt', 'DESC')
            .paginate();
    }
}
