import { fieldCtr } from "./field.controller";

const resolvers = {
    Query: {
      getField: (_, args, context) => fieldCtr.getField(context, args),
    },
    Mutation:{
    }
};

export default resolvers;