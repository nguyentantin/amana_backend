import { NotFoundException } from '@nestjs/common';

export class ResourceNotFoundException extends NotFoundException {
    constructor(error ?: string) {
        super('resource_not_found', error);
    }
}
