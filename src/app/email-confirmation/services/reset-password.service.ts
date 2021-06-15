import { BadRequestException, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { DeepPartial } from 'typeorm';
import * as moment from 'moment';
import { MailerService } from '@nestjs-modules/mailer';
import { isUndefined } from '@nestjs/common/utils/shared.utils';

import { EmailConfirmationService } from './email-confirmation.service';
import { ConfirmationType, EmailConfirmation, StatusType } from '../dto/email-confirmation.entity';
import { EmailConfirmationRepository } from '../email-confirmation.repository';
import { UserService } from '../../user/user.service';
import Common from '../../../helpers/common';
import { PasswordConfirmationDto } from '../dto/password-confirmation.dto';

@Injectable()
export class ResetPasswordService extends EmailConfirmationService {
    constructor(
        @InjectRepository(EmailConfirmation)
        protected readonly emailConfirmationRepo: EmailConfirmationRepository,
        protected readonly mailerService: MailerService,
        private readonly userService: UserService,
    ) {
        super();
        this.mailSubject = 'Please verify your reset password';
        this.template = 'reset-password';
    }

    /**
     * Send reset password mail implementation.
     * @param {string} email
     * @throws {UserNotFoundException}
     * @return true;
     */
    async run(email: string): Promise<true> {
        // @TODO: implement check user has password. User from social login cannot reset password.
        /** Check email exist */
        const user = await this.userService.findUserByEmailOrFail(email);

        const token = Common.generateToken();
        const emailConfirmationData: DeepPartial<EmailConfirmation> = {
            email,
            token,
            type: ConfirmationType.RESET_PASSWORD,
            expiredAt: moment(new Date()).add(60, 'minutes').toDate(),
            status: StatusType.UNCONFIRMED,
        };

        /** Create new record in database */
        await this.saveEmailConfirmation(emailConfirmationData);

        /** Send mail */
        this.sendResetPasswordMail(email, token, user.name);

        return true;
    }

    /**
     * Prepare options and send email to user
     * @param {string} email
     * @param {string} token
     * @param {string} name
     */
    async sendResetPasswordMail(email: string, token: string, name: string) {
        const resetPasswordLink = Common.generateFrontendLink('/pwd/reset', { email, token });
        this.sendMailOptions = {
            subject: this.mailSubject,
            to: email,
            template: this.template,
            context: {
                name,
                resetPasswordLink,
            },
        };

        this.sendEmail();
    }

    /**
     * Check token and email match requirement
     * then change password if everything matched.
     * @param {PasswordConfirmationDto} data
     * @throws {BadRequestException}
     * @throws {UserNotFoundException}
     * @return {Promise<true>}
     */
    async verifyPassword(data: PasswordConfirmationDto): Promise<true> {
        const emailConfirmation = await this.matchesToken(data.email, data.token);
        await this.changePassword(data.email, data.password);
        await this.changeEmailConfirmationStatus(emailConfirmation, StatusType.CONFIRMED);

        return true;
    }

    /**
     * Check token has match.
     * @param {string} email
     * @param {string} token
     * @return {Promise<EmailConfirmation>}
     */
    async matchesToken(email: string, token: string): Promise<EmailConfirmation> {
        const confirm = await this.emailConfirmationRepo.findOne({
            where: {
                email,
                token,
                status: StatusType.UNCONFIRMED,
            },
            order: {
                createdAt: 'DESC',
            },
        });

        if (isUndefined(confirm)) {
            throw new BadRequestException('token_mismatch', 'token_mismatch');
        }

        if (moment().isAfter(confirm.expiredAt)) {
            throw new BadRequestException('token_expired', 'token_expired');
        }

        return confirm;
    }

    /**
     * Change user password.
     * @param {string} email
     * @param {string} password
     */
    async changePassword(email: string, password: string) {
        const user = await this.userService.findUserByEmailOrFail(email);

        user.password = password;

        await this.userService.saveUser(user);
    }
}
