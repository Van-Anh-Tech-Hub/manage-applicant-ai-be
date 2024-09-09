import { Router } from 'express';
import { companyCtr } from './company.controller';

export const companyRouter = Router();

companyRouter.get('/', companyCtr.getCompanies);
