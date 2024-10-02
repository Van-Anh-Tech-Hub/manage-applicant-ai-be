import { GraphQLError } from 'graphql';
import { IMiddlewareFunction } from 'graphql-middleware';

const authenticate: IMiddlewareFunction<{ req: Request }> = async (resolve, parent, args, context, info) => {
  const authorization = context.req.headers.authorization;

  if (!authorization) {
    throw new GraphQLError('Authorization header is missing', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }

  const token = authorization.replace('Bearer ', '');

  try {
    const user = "123"

    if (!user) {
      throw new Error('Invalid or expired token');
    }

    context.user = user;

    return resolve(parent, args, context, info);
  } catch (err) {
    throw new GraphQLError('Invalid or expired token', {
      extensions: {
        code: 'UNAUTHENTICATED',
      },
    });
  }
};

export default authenticate;
