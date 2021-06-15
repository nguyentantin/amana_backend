import { Connection, EntitySubscriberInterface, EventSubscriber, InsertEvent } from 'typeorm';
import { EmailConfirmation } from './dto/email-confirmation.entity';
import { EmailConfirmationService } from './services/email-confirmation.service';
import { AppLogger } from '../../core/logger';

@EventSubscriber()
export class EmailConfirmationSubscriber implements EntitySubscriberInterface<EmailConfirmation> {
    constructor(
        connection: Connection,
        // private readonly userConfirmService: EmailConfirmationService,
    ) {
        connection.subscribers.push(this);
    }
    private logger = new AppLogger(EmailConfirmationService.name);

    listenTo() {
        return EmailConfirmation;
    }

    async afterInsert(event: InsertEvent<EmailConfirmation>) {
        // this.logger.log('Send mail after insert record');
        // switch (event.entity.type) {
        //     case ConfirmationType.RESET_PASSWORD:
        //         // According to @cuong.nq: run this in parallel and not care about result
        //         // noinspection ES6MissingAwait
        //         this.userConfirmService.sendResetPasswordMail(event.entity);
        //         break;
        //     case ConfirmationType.REGISTER:
        //         // According to @cuong.nq: run this in parallel and not care about result
        //         // noinspection ES6MissingAwait
        //         this.userConfirmService.sendVerifyUserMail(event.entity);
        //         break;
        //     default:
        //         this.logger.error('Type has not been register');
        // }
    }
}
