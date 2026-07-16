import {
  Injectable,
  CanActivate,
  ExecutionContext,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { Role } from '../enums/role.enum';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // Read the roles from the decorator
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>(
      ROLES_KEY,
      [
        context.getHandler(),
        context.getClass(),
      ],
    );

    // If no @Roles decorator is used,
    // allow access.
    if (!requiredRoles) {
      return true;
    }

    // Get the logged-in user
    const request = context.switchToHttp().getRequest();

    const user = request.user;

    // Check if the user's role matches
    return requiredRoles.includes(user.role);
  }
}