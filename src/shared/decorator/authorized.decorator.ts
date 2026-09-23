import { createParamDecorator, ExecutionContext } from '@nestjs/common';

import type { Request } from 'express';

export const Authorized = createParamDecorator(
  (data: 'userId' | undefined, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest<
      Request & {
        user: {
          userId: string;
        };
      }
    >();

    const user = request.user;

    if (!user) {
      return undefined;
    }

    return data ? user[data] : user;
  },
);
