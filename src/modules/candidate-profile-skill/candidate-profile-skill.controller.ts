import { CandidateProfileSkillError } from "#shared/constants/error-response";
import { I_Context, I_FindOne } from "#shared/typescript";
import { throwResponse } from "#shared/utils";
import { CandidateProfileSkill } from "./candidate-profile-skill.model";

export const candidateProfileSkillCtr = {
  getCandidateProfileSkill: async (_: I_Context, { where, orderBy }: I_FindOne) => {
    const candidatePSFound = await CandidateProfileSkill.findOne({
      where,
      order: orderBy
    });

    if (!candidatePSFound) {
      throwResponse({ ...CandidateProfileSkillError.CANDIDATE_PROFILE_SKILL_01 });
    }

    return {
      success: true,
      result: candidatePSFound?.dataValues,
    };
  },
}