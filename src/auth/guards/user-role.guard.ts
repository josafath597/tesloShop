import { META_ROLES } from '@app/auth/decorators';
import { User } from '@app/auth/entities/user.entity';
import { BadRequestException, CanActivate, ExecutionContext, ForbiddenException, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';

@Injectable()
export class UserRoleGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}
  canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
    const validRoles: string[] = this.reflector.get(META_ROLES, context.getHandler());
    if (!validRoles) return true;
    if (!validRoles.length) return true;
    const req = context.switchToHttp().getRequest();
    const user: User = req.user;
    if (!user) throw new BadRequestException('User not found');
    for (const role of user.roles) {
      if (validRoles.includes(role)) return true;
    }
    throw new ForbiddenException(`The user ${user.fullName} need a valid role: [${validRoles}]`);
  }
}
