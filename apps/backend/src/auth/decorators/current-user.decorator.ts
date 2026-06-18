import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from '../entities/user.entity';

export const CurrentUser = createParamDecorator(
  (data: unknown, context: ExecutionContext): User | null => {
    const gqlContext = GqlExecutionContext.create(context);
    return gqlContext.getContext().req?.user || null;
  },
);
