import { NextFunction, Request, Response } from "express";

import { Field } from "./field.model"
import { ResponseData } from "#shared/utils";

export const fieldCtr = {
  getFields: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const fields = await Field.findAll();
      ResponseData(res, 200, {
        success: true,
        result: {
          fields
        }
      })
    } catch (error) {
      next(error)
    }
  },
}