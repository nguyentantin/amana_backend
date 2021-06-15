import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminGuard } from '../../app/role/admin.guard';

export function SuperAuth() {
    return applyDecorators(
        UseGuards(AuthGuard(), AdminGuard),
    );
}
