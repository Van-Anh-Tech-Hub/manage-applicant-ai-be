import { jobCtr } from "./job.controller";

const resolvers = {
    Query: {
      getJob: (_, args, context) => jobCtr.getJob(context, args),
    },
    Mutation:{
    }
};

export default resolvers;