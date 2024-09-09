import { NextFunction, Request, Response } from 'express';

import { Company } from "./company.model"
import { ResponseData } from '#shared/utils';

export const companyCtr = {
  getCompanies: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const companies = await Company.findAll();
      ResponseData(res, 200, {
        success: true,
        result: {
          companies
        }
      })
    } catch (error) {
      next(error)
    }
  },
}