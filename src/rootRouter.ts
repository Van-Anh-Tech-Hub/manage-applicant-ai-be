import { Router } from 'express';

import { companyRouter } from '#modules/company';
import { fieldRouter } from '#modules/field';
import { userRouter } from '#modules/user';

export const rootRouter = Router();

rootRouter.get('/', (req, res, next) => {
  res.status(200).json({ message: 'Server is running!' });
  next();
});

rootRouter.use('/fields', fieldRouter);
rootRouter.use('/users', userRouter);
rootRouter.use('/companies', companyRouter);
