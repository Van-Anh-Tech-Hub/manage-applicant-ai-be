import { I_BaseAttributes } from "#shared/typescript";

export enum E_Role {
  ADMIN = "admin",
  CANDIDATE = "candidate",
  RECRUITER = "recruiter",
}

export interface I_User extends I_BaseAttributes {
  fullName: string;
  email: string;
  password: string;
  role: E_Role;
}