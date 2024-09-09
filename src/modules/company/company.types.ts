import { I_BaseAttributes } from "#shared/typescript";

export interface I_Company extends I_BaseAttributes {
  userId: string;
  description?: string;
  name: string;
  working_address: string;
  fieldId: string;
  employee_size?: string;// Quy mô nhân sự
}