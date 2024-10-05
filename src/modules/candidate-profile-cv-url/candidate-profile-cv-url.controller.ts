import { CandidateProfileCVUrlError } from "#shared/constants/error-response";
import { I_Context, I_FindOne } from "#shared/typescript";
import { throwResponse } from "#shared/utils";
import { CandidateProfileCVUrl } from "./candidate-profile-cv-url.model";

export const candidateProfileCvUrlCtr = {
  getCandidateProfileCvUrl: async (_: I_Context, { where, orderBy }: I_FindOne) => {
    const candidatePCUFound = await CandidateProfileCVUrl.findOne({
      where,
      order: orderBy
    });

    if (!candidatePCUFound) {
      throwResponse({ ...CandidateProfileCVUrlError.CANDIDATE_PROFILE_CV_URL_01 });
    }

    return {
      success: true,
      result: candidatePCUFound?.dataValues,
    };
  },
}