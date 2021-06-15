import { CanActivate, ExecutionContext, ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { RoleService } from './role.service';
import { isEmpty } from '@nestjs/common/utils/shared.utils';
import { Reflector } from '@nestjs/core';
import { AuthService } from '../auth/auth.service';
import { RoleType } from '../../core/constants/role-type';

@Injectable()
export class RolesGuard implements CanActivate {
    @Inject(RoleService) private readonly roleService: RoleService;

    constructor(
        private readonly reflector: Reflector,
    ) {
    }

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const projectId = req.params.id;
        AuthService.setAuthUser(user);

        const roleNames = user.roles.map(role => role.name);

        if (roleNames.includes(RoleType.SUPER_ADMIN)) {
            return true;
        }

        const roles = this.reflector.get<string[]>(
            'roles',
            context.getHandler(),
        );

        if (!roles) {
            return true;
        }

        const hasRole = await this.roleService.getRoles(user.id, projectId, [...roles]);

        if (isEmpty(hasRole)) {
            throw new ForbiddenException();
        }

        return true;
    }
}
