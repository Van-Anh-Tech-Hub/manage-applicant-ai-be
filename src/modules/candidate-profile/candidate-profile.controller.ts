import { CandidateProfileError } from "#shared/constants/error-response";
import { I_Context, I_FindOne } from "#shared/typescript";
import { throwResponse } from "#shared/utils";
import { CandidateProfile } from "./candidate-profile.model";

export const candidateProfileCtr = {
  getCandidateProfile: async (_: I_Context, { where, orderBy }: I_FindOne) => {
    const candidatePCUFound = await CandidateProfile.findOne({
      where,
      order: orderBy
    });

    if (!candidatePCUFound) {
      throwResponse({ ...CandidateProfileError.CANDIDATE_PROFILE_01 });
    }

    return {
      success: true,
      result: candidatePCUFound?.dataValues,
    };
  },
}