import { BadRequestException } from '@nestjs/common';

export class InactiveUserException extends BadRequestException {
    constructor(message ?: string) {
        super(message || 'please_check_your_email_to_login', 'user_inactive');
    }
}
