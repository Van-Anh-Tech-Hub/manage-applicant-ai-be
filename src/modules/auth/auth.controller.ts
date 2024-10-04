import omit from 'lodash/omit';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

import config from "#config";
import { I_Context, I_Return } from "#shared/typescript";
import { I_Input_CheckAuth, I_Input_CheckToken, I_Input_Login, I_Input_Register, I_Response_Auth, I_SessionPayload } from "./auth.types";
import { throwResponse } from '#shared/utils';
import { AuthError } from '#shared/constants/error-response';
import { E_Role, I_User, userCtr } from '#modules/user';

export const authCtr = {
  checkAuth: async ({ req }: I_Context, input?: I_Input_CheckAuth): Promise<I_Response_Auth> => {
    if (req?.session?.user) {
      const userFound = await userCtr.getUser({ req }, {
        where: {
          id: req?.session?.user.id
        }
      })

      if (!userFound.success) {
        req.session.destroy(() => { });
        throwResponse({ ...AuthError.AUTH_03 });
      }

      return {
        success: true,
        result: {
          user: userFound.result,
          ...(input?.token && { token: input.token }),
        },
      };
    }
    if (input?.token) {
      return authCtr.checkToken({ req }, { token: input.token });
    }

    return {
      success: false,
    };
  },
  checkToken: async (
    context: I_Context,
    input: I_Input_CheckToken
  ): Promise<I_Response_Auth> => {
    const { token } = input;

    try {
      const decodedToken = jwt.verify(token, config.SECRET) as I_SessionPayload;

      const userFound = await userCtr.getUser(context, {
        where: {
          id: decodedToken.userId,
        },
      });

      if (!userFound.success) {
        throwResponse({ ...AuthError.AUTH_04 });
      }

      return {
        success: true,
        result: {
          user: userFound.result,
          token,
        },
      };
    } catch (error) {
      return throwResponse({ ...AuthError.AUTH_05 });
    }
  },
  generateToken: (_: I_Context, { id }: { id: string }): string => {
    return jwt.sign({ createdAt: Date.now(), userId: id } as I_SessionPayload, config.SECRET, {
      expiresIn: config.SESSION.MAX_AGE,
    });
  },

  register: async ({ req }: I_Context, input: I_Input_Register): Promise<I_Response_Auth> => {
    const { email, ...rest } = input;

    const userFound = await userCtr.getUser({ req }, {
      where: {
        email
      }
    });
    if (userFound) {
      throwResponse({ ...AuthError.AUTH_01 });
    }

    const userCreated = await userCtr.createUser({ req }, {
      input: {
        email,
        ...rest
      }
    });

    const token = authCtr.generateToken({ req }, { id: userCreated.result?.id! });
    req.session.user = userCreated.result;

    return {
      success: true,
      result: {
        token,
        user: userCreated.result
      }
    };
  },

  login: async ({ req }: I_Context, input: I_Input_Login): Promise<I_Response_Auth> => {
    const { email, password, rememberMe } = input;

    const userFound = await userCtr.getUser({ req }, {
      where: {
        email
      }
    })
    if (!userFound) {
      throwResponse({ ...AuthError.AUTH_01 });
    }

    const isPasswordValid = await bcrypt.compare(password, userFound.result?.password!);

    if (!userFound.success || !userFound.result || !userFound.result.id || !isPasswordValid) {
      throwResponse({ ...AuthError.AUTH_02 });
    }

    const token = rememberMe ? authCtr.generateToken({ req }, { id: userFound.result?.id! }) : "";
    // req.session.user = userFound.result;
    req.session.user = omit(userFound.result as I_User, ['password']);

    return {
      success: true,
      result: {
        token,
        user: userFound.result
      }
    };
  },
  logout: async ({ req }: I_Context): Promise<I_Response_Auth> => {
    if (req?.session?.user) {
      req.session.destroy((err) => {
        if (err) {
          throwResponse({ ...AuthError.AUTH_06 });
        }
      });

      return {
        success: true,
      };
    }

    return throwResponse({ ...AuthError.AUTH_06 });
  },
}