import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { UserDoc, UserEntity } from '@app/common/entities/auth/user.entity';

const getCurrentUserByContext = (context: ExecutionContext): UserDoc => {
  return context.switchToHttp().getRequest().user;
};

export const CurrentUser = createParamDecorator(
  (_data: unknown, context: ExecutionContext) =>
    getCurrentUserByContext(context),
);

export const GetUser = createParamDecorator(
  (returnPlain: boolean, ctx: ExecutionContext): UserDoc | UserEntity => {
    const { __user } = ctx.switchToHttp().getRequest();
    return returnPlain ? __user.toObject() : __user;
  },
);
