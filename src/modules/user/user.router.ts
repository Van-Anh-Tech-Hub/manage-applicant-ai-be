import { Router } from 'express';
import { userCtr } from './user.controller';

export const userRouter = Router();

userRouter.get('/', userCtr.getUsers);
userRouter.post('/', userCtr.createUser);