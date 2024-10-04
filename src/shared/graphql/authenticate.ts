import { E_Role } from '#modules/user';
import { AuthError } from '#shared/constants/error-response';
import { I_Context } from '#shared/typescript';
import { throwResponse } from '#shared/utils';
import { GraphQLError, GraphQLResolveInfo } from 'graphql';
import { IMiddlewareFunction } from 'graphql-middleware';

const authenticate = (roles: E_Role[]): IMiddlewareFunction<{ req: Request }> => {
  return async (resolve, parent, args, context: I_Context, info: GraphQLResolveInfo) => {
    const userLoggedIn = context.req.session.user;

    if (!userLoggedIn) {
      return throwResponse({ ...AuthError.AUTH_07 })
    }

    const hasRequiredRole = roles.includes(userLoggedIn.role!);
    if (!hasRequiredRole) {
      return throwResponse({ ...AuthError.AUTH_08 })
    }
    return resolve(parent, args, context, info);
  };
};

export default authenticate;
