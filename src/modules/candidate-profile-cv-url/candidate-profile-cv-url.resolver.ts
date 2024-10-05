import { candidateProfileCvUrlCtr } from "./candidate-profile-cv-url.controller";

const resolvers = {
    Query: {
      getCandidateProfileCvUrl: (_, args, context) => candidateProfileCvUrlCtr.getCandidateProfileCvUrl(context, args),
    },
    Mutation:{
    }
};

export default resolvers;