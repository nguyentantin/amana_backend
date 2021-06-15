import { Injectable } from '@nestjs/common';
import { EmailConfirmationService } from './email-confirmation.service';
import { InjectRepository } from '@nestjs/typeorm';
import { EmailConfirmation } from '../dto/email-confirmation.entity';
import { EmailConfirmationRepository } from '../email-confirmation.repository';
import { MailerService } from '@nestjs-modules/mailer';
import { UserService } from '../../user/user.service';
import { ObjectLiteral } from 'typeorm';
import Common from '../../../helpers/common';

@Injectable()
export class InviteUserService extends EmailConfirmationService {

    constructor(
        @InjectRepository(EmailConfirmation)
        protected readonly emailConfirmationRepo: EmailConfirmationRepository,
        protected readonly mailerService: MailerService,
        private readonly userService: UserService,
    ) {
        super();
        this.mailSubject = 'Welcome to Amana App';
        this.template = 'invite-user';
    }
    /**
     * Send invitation mail to user.
     * @param {string} email
     * @param {ObjectLiteral} options
     */
    async run(email: string, options?: ObjectLiteral): Promise<true> {
        /** Check email exist */
        const user = await this.userService.findUserByEmailOrFail(email);

        /** Send mail */
        this.sendInvitationMail(email, user.name, options.password);
        return true;
    }

    /**
     * Prepare options and send email to user
     * @param {string} email
     * @param {string} name
     * @param {string} password
     */
    async sendInvitationMail(email: string, name: string, password: string) {
        const verifyUserLink = Common.generateFrontendLink('/sign-in');
        this.sendMailOptions = {
            subject: this.mailSubject,
            to: email,
            template: this.template,
            context: {
                name,
                password,
                verifyUserLink,
            },
        };

        this.sendEmail();
    }
}
