import { jobApplicantCtr } from "./job-applicant.controller";

const resolvers = {
    Query: {
      getJobApplicant: (_, args, context) => jobApplicantCtr.getJobApplicant(context, args),
    },
    Mutation:{
    }
};

export default resolvers;