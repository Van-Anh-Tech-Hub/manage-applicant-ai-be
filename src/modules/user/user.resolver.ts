import { userCtr } from '#modules/user/user.controller';

const resolvers = {
    Query: {
        getUser: (_, args, context) => userCtr.getUser(context, args),
        getUsers: (_, args, context) => userCtr.getUsers(context, args)
    },
    Mutation:{
        createUser: (_, args, context) => userCtr.createUser(context, args),
        updateUser: (_, args, context) => userCtr.updateUser(context, args),
        deleteUser: (_, args, context) => userCtr.deleteUser(context, args),
        softDeleteUser: (_, args, context) => userCtr.softDeleteUser(context, args),
        restoreUser: (_, args, context) => userCtr.restoreUser(context, args),
    }
};

export default resolvers;