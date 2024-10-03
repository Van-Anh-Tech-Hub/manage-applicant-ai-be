import { I_BaseAttributes } from "#shared/typescript";

export interface I_Job extends I_BaseAttributes {
  title: string;
  description: string;
  salary: number;
  position: string;
  recruiterId: string;
}