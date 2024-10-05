import { companyCtr } from "./company.controller";

const resolvers = {
    Query: {
      getCompany: (_, args, context) => companyCtr.getCompany(context, args),
    },
    Mutation:{
    }
};

export default resolvers;