import { BadRequestException } from '@nestjs/common';

export class AlreadyActiveUserException extends BadRequestException {
    constructor(message ?: string) {
        super(message || 'already_active_user', 'already_active_user');
    }
}
