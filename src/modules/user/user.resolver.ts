import { userCtr } from '#modules/user/user.controller';

const resolvers = {
    Query: {
        getUser: (_, args, context) => userCtr.getUser(context, args),
        // getUsers: (_, args, context) => userCtr.getUsers(context, args)
    },
    Mutation:{
        createUser: (_, args, context) => userCtr.createUser(context, args),
    }
};

export default resolvers;