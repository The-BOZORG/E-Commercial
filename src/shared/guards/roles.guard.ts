import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

import { UserRole } from 'src/auth/enum/enum.auth';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.get<UserRole[]>('roles', context.getHandler());

    if (!roles) return true;

    const { user } = context.switchToHttp().getRequest();

    if (!user) throw new ForbiddenException('User not authenticated');

    if (!roles.includes(user.role))
      throw new ForbiddenException('Access denied');

    return true;
  }
}
