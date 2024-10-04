import { I_BaseAttributes } from "#shared/typescript";

export enum E_Role {
  ADMIN = "ADMIN",
  CANDIDATE = "CANDIDATE",
  RECRUITER = "RECRUITER",
}

export interface I_User extends I_BaseAttributes {
  fullName?: string;
  email?: string;
  password?: string;
  role?: E_Role;
}

export interface I_Input_Create_User {
  fullName: string;
  email: string;
  password: string;
  role: E_Role;
}

export interface I_Input_Update_User {
  fullName?: string;
  password?: string;
  role?: E_Role;
}