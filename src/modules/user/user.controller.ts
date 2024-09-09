import { NextFunction, Request, Response } from 'express';
import bcrypt from 'bcrypt';

import { User } from './user.model';
import { ResponseData } from '#shared/utils';

export const userCtr = {
  getUsers: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await User.findAll();
      ResponseData(res, 200, {
        success: true,
        result: {
          users
        }
      })
    } catch (error) {
      next(error)
    }
  },
  createUser: async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { fullName, email, password, role } = req.body;
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ fullName, email, password: hashedPassword, role });
      res.status(201).json(user);
    } catch (error) {
      next(error)
    }
  }
}