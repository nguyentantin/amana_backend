import { RoleType } from '../constants/role-type';
import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { RolesGuard } from '../../app/role/roles.guard';
import { Roles } from './roles.decorator';
import { isEmpty } from '@nestjs/common/utils/shared.utils';

export function Auth(...roles: RoleType[]) {
    if (isEmpty(roles)) {
        return applyDecorators(
            UseGuards(AuthGuard(), RolesGuard),
        );
    }

    return applyDecorators(
        Roles(...roles),
        UseGuards(AuthGuard(), RolesGuard),
    );
}
