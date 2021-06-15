import { BadRequestException } from '@nestjs/common';

export class PasswordNotMatchException extends BadRequestException {
    constructor(message ?: string) {
        super(message || 'email_or_password_do_not_match', 'email_or_password_do_not_match');
    }
}
