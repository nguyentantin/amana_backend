import { EntityRepository, Repository } from 'typeorm';
import { EmailConfirmation } from './dto/email-confirmation.entity';

@EntityRepository(EmailConfirmation)
export class EmailConfirmationRepository extends Repository<EmailConfirmation> {
    countEmailVerification() {

    }
}
