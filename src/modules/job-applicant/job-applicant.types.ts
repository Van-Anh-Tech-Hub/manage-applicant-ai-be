import { I_BaseAttributes } from "#shared/typescript";

export interface I_JobApplicant extends I_BaseAttributes {
  jobId: string;
  userId: string;
  cvUrl: string;
}
