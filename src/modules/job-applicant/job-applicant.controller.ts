import { JobApplicantError } from "#shared/constants/error-response";
import { I_Context, I_FindOne } from "#shared/typescript";
import { throwResponse } from "#shared/utils";
import { JobApplicant } from "./job-applicant.model";

export const jobApplicantCtr = {
  getJobApplicant: async (_: I_Context, { where, orderBy }: I_FindOne) => {
    const jobApplicantFound = await JobApplicant.findOne({
      where,
      order: orderBy
    });

    if (!jobApplicantFound) {
      throwResponse({ ...JobApplicantError.JOB_APPLICANT_01 });
    }

    return {
      success: true,
      result: jobApplicantFound?.dataValues,
    };
  },
}