import { BadRequestException } from '@nestjs/common';

export class UserNotFoundException extends BadRequestException {
    constructor(message ?: string) {
        super(message || 'user_not_found', 'user_not_found');
    }
}
