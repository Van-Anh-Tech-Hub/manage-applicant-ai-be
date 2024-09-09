import { Router } from 'express';

import { fieldCtr } from './field.controller';

export const fieldRouter = Router();

fieldRouter.get('/', fieldCtr.getFields);