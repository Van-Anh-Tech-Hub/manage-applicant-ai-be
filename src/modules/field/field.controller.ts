import { NextFunction, Request, Response } from "express";

import { Field } from "./field.model"
import { throwResponse } from "#shared/utils";
import { I_Context, I_FindOne } from "#shared/typescript";
import { FieldError } from "#shared/constants/error-response";

export const fieldCtr = {
  getField: async (_: I_Context, { where, orderBy }: I_FindOne) => {
    const fieldFound = await Field.findOne({
      where,
      order: orderBy
    });

    if (!fieldFound) {
      throwResponse({ ...FieldError.FIELD_01 });
    }

    return {
      success: true,
      result: fieldFound?.dataValues,
    };
  },
}