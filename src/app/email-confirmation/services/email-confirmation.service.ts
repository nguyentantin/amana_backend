import { ISendMailOptions, MailerService } from '@nestjs-modules/mailer';
import { DeepPartial, ObjectLiteral } from 'typeorm';

import { EmailConfirmationRepository } from '../email-confirmation.repository';
import { EmailConfirmation, StatusType } from '../dto/email-confirmation.entity';
import { AppLogger } from '../../../core/logger';

/**
 * TypeScript example about name private property with underscore
 * https://www.typescriptlang.org/docs/handbook/classes.html#accessors
 */
// tslint:disable:variable-name
export abstract class EmailConfirmationService {
    private logger = new AppLogger(EmailConfirmationService.name);

    protected readonly emailConfirmationRepo: EmailConfirmationRepository;
    protected readonly mailerService: MailerService;

    /**
     * The options when send mail.
     */
    private _sendMailOptions: ISendMailOptions;

    /**
     * The template of email.
     */
    private _template: string;

    /**
     * The subject of email.
     */
    private _mailSubject: string;

    /**
     * Getter of _sendMailOptions property.
     */
    get sendMailOptions(): ISendMailOptions {
        return this._sendMailOptions;
    }

    /**
     * Setter of _sendMailOptions property.
     * @param options
     */
    set sendMailOptions(options: ISendMailOptions) {
        this._sendMailOptions = {...options};
    }

    /**
     * Getter of _template property.
     */
    get template(): string {
        return this._template;
    }

    /**
     * Setter of _template property.
     * @param template
     */
    set template(template: string) {
        this._template = template;
    }

    /**
     * Getter of _mailSubject property.
     */
    get mailSubject(): string {
        return this._mailSubject;
    }

    /**
     * Setter of _mailSubject property
     * @param subject
     */
    set mailSubject(subject: string) {
        this._mailSubject = subject;
    }

    /**
     * Implement send mail business logic
     * @param {string} email
     * @param {ObjectLiteral} options
     */
    abstract async run(email: string, options?: ObjectLiteral): Promise<any>;

    /**
     * Create new record of EmailConfirmation.
     * @param {DeepPartial<EmailConfirmation>} entityData
     * @return {Promise<EmailConfirmation>}
     */
    async saveEmailConfirmation(entityData: DeepPartial<EmailConfirmation>): Promise<EmailConfirmation> {
        return await this.emailConfirmationRepo.save(entityData);
    }

    /**
     * Send email to user.
     * @return {Promise<void>>}
     */
    sendEmail(): Promise<void> {
        return this.mailerService.sendMail(this._sendMailOptions)
            .then(() => {
                this.logger.log(`Send mail success to ${this._sendMailOptions.to}`);
            })
            .catch((e) => {
                this.logger.error(`Send mail error to ${this._sendMailOptions.to}`, e);
            });
    }

    /**
     * Change email confirmation status.
     * @param {EmailConfirmation} emailConfirmation
     * @param {StatusType} status
     * @return {Promise<EmailConfirmation>}
     */
    async changeEmailConfirmationStatus(emailConfirmation: EmailConfirmation, status: StatusType): Promise<EmailConfirmation> {
        emailConfirmation.status = status;
        return await this.emailConfirmationRepo.save(emailConfirmation);
    }
}
