import { candidateProfileSkillCtr } from "./candidate-profile-skill.controller";

const resolvers = {
    Query: {
      getCandidateProfileSkill: (_, args, context) => candidateProfileSkillCtr.getCandidateProfileSkill(context, args),
    },
    Mutation:{
    }
};

export default resolvers;