import { ExecutionContext, InternalServerErrorException, createParamDecorator } from '@nestjs/common';
import { User } from '../entities/user.entity';

type userType = 'id' | 'email' | 'fullName' | 'roles' | 'isActive';

export const GetUser = createParamDecorator((data: userType, ctx: ExecutionContext) => {
  const req = ctx.switchToHttp().getRequest();
  const user: User = req.user;
  if (!user) throw new InternalServerErrorException('User not found (request)');
  if (data) return user[data];
  return user;
});
