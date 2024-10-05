import { Company } from "./company.model"
import { throwResponse } from '#shared/utils';
import { I_Context, I_FindOne } from '#shared/typescript';
import { CompanyError } from '#shared/constants/error-response';

export const companyCtr = {
  getCompany: async (_: I_Context, { where, orderBy }: I_FindOne) => {
    const fieldFound = await Company.findOne({
      where,
      order: orderBy
    });

    if (!fieldFound) {
      throwResponse({ ...CompanyError.COMPANY_01 });
    }

    return {
      success: true,
      result: fieldFound?.dataValues,
    };
  },
}