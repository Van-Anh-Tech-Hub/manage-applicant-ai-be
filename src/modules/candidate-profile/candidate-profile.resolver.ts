import { candidateProfileCtr } from "./candidate-profile.controller";

const resolvers = {
    Query: {
      getCandidateProfile: (_, args, context) => candidateProfileCtr.getCandidateProfile(context, args),
    },
    Mutation:{
    }
};

export default resolvers;