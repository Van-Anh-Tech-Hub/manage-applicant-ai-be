import { JobError } from "#shared/constants/error-response";
import { I_Context, I_FindOne } from "#shared/typescript";
import { throwResponse } from "#shared/utils";
import { Job } from "./job.model";

export const jobCtr = {
  getJob: async (_: I_Context, { where, orderBy }: I_FindOne) => {
    const jobFound = await Job.findOne({
      where,
      order: orderBy
    });

    if (!jobFound) {
      throwResponse({ ...JobError.JOB_01 });
    }

    return {
      success: true,
      result: jobFound?.dataValues,
    };
  },
}