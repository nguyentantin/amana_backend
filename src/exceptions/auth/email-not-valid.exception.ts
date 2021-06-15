import { BadRequestException } from '@nestjs/common';

export class EmailNotValidException extends BadRequestException {
    constructor(message ?: string) {
        super(message || 'please_type_correct_email', 'email_is_not_valid');
    }
}
