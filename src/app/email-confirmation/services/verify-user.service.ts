import { InjectRepository } from '@nestjs/typeorm';
import { BadRequestException, Injectable } from '@nestjs/common';
import { isUndefined } from '@nestjs/common/utils/shared.utils';
import { MailerService } from '@nestjs-modules/mailer';
import { DeepPartial } from 'typeorm';
import * as moment from 'moment';

import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmationType, EmailConfirmation, StatusType } from '../dto/email-confirmation.entity';
import { EmailConfirmationRepository } from '../email-confirmation.repository';
import { UserService } from '../../user/user.service';
import { AlreadyActiveUserException } from '../../../exceptions/auth/already-active-user.exception';
import Common from '../../../helpers/common';
import { VerifyUserDto } from '../../auth/dto/verify-user.dto';
import { User } from '../../user/dto/user.entity';
import { UserNotFoundException } from '../../../exceptions/auth/user-not-found.exception';

@Injectable()
export class VerifyUserService extends EmailConfirmationService {
    constructor(
        @InjectRepository(EmailConfirmation)
        protected readonly emailConfirmationRepo: EmailConfirmationRepository,
        protected readonly mailerService: MailerService,
        private readonly userService: UserService,
    ) {
        super();
        this.mailSubject = 'Verify Email';
        this.template = 'verify-user';
    }

    /**
     * Send verify user mail implementation.
     * @param {string} email
     * @throws {UserNotFoundException}
     * @return true;
     */
    async run(email: string): Promise<true> {
        /** Check email exist */
        const user = await this.userService.findUserByEmailOrFail(email);

        // @TODO: implement send email max 3 times in one hours

        if (user.isActive) {
            throw new AlreadyActiveUserException();
        }

        const token = Common.generateToken();
        const emailConfirmationData: DeepPartial<EmailConfirmation> = {
            email,
            token,
            type: ConfirmationType.VERIFY_USER,
            expiredAt: moment(new Date()).add(process.env.TOKEN_TIMEOUT, 'seconds').toDate(),
            status: StatusType.UNCONFIRMED,
        };

        /** Create new record in database */
        await this.saveEmailConfirmation(emailConfirmationData);

        /** Send mail */
        this.sendVerifyUserMail(email, token, user.name);

        return true;
    }

    /**
     * Prepare options and send email to user
     * @param {string} email
     * @param {string} token
     * @param {string} name
     */
    async sendVerifyUserMail(email: string, token: string, name: string) {
        const verifyUserLink = Common.generateFrontendLink('/email-verification', { email, token });
        this.sendMailOptions = {
            subject: this.mailSubject,
            to: email,
            template: this.template,
            context: {
                name,
                verifyUserLink,
            },
        };

        this.sendEmail();
    }

    /**
     * Check token is matching and then if true active this user.
     * @param {VerifyUserDto} verifyUserDto
     * @return {Promise<true>}
     */
    async verifyUser(verifyUserDto: VerifyUserDto): Promise<true> {
        const emailConfirmation = await this.isValidToken(verifyUserDto);
        const user = await this.userService.findUserByEmailOrFail(verifyUserDto.email);

        if (user.isActive) {
            throw new AlreadyActiveUserException();
        }

        await this.activeUser(user);
        await this.changeEmailConfirmationStatus(emailConfirmation, StatusType.CONFIRMED);

        return true;
    }

    /**
     * Check token is valid.
     * @param {VerifyUserDto} verifyUserDto
     * @return {Promise<EmailConfirmation>}
     */
    async isValidToken(verifyUserDto: VerifyUserDto): Promise<EmailConfirmation> {
        const emailConfirmation = await this.emailConfirmationRepo.findOne({
            where: {
                email: verifyUserDto.email,
                status: StatusType.UNCONFIRMED,
                token: verifyUserDto.token,
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (isUndefined(emailConfirmation)) {
            throw new BadRequestException('token_mismatch', 'token_mismatch');
        }

        if (moment().isAfter(emailConfirmation.expiredAt)) {
            throw new BadRequestException('token_expired', 'token_expired');
        }

        return emailConfirmation;
    }

    /**
     * Change status of user to active.
     * @param {User} user
     * @return {User}
     */
    async activeUser(user: User): Promise<User> {
        user.isActive = true;
        return await this.userService.saveUser(user);
    }
}
