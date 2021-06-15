import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { RoleType } from '../../core/constants/role-type';

@Injectable()
export class AdminGuard implements CanActivate {
    canActivate(context: ExecutionContext): boolean {
        const req = context.switchToHttp().getRequest();
        const user = req.user;
        const roleNames = user.roles.map(role => role.name);

        if (!roleNames.includes(RoleType.SUPER_ADMIN)) {
            throw new ForbiddenException();
        }

        AuthService.setAuthUser(user);

        return true;
    }
}
