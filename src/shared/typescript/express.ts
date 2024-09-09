import { Request as RequestExpress } from 'express';
import { Session } from 'express-session';

// import { I_User } from '#modules/user/user.types';

interface I_Request extends RequestExpress {
  session: Session & {
    // user?: I_User;
  };
}

export interface I_Context {
  req: I_Request;
}
