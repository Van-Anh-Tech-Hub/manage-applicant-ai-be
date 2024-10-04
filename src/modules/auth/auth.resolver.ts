import { authCtr } from './auth.controller';

const authResolver = {
  Query: {
    checkAuth: (_, args, context) => authCtr.checkAuth(context, args),
  },
  Mutation: {
    register: (_, args, context) => authCtr.register(context, args),
    login: (_, args, context) => authCtr.login(context, args),
    logout: (_, __, context) => authCtr.logout(context),
  },
};

export default authResolver;
