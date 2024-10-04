import { E_Role, I_User } from "#modules/user";

export interface I_SessionPayload {
  createdAt: number;
  userId: string;
}
export interface I_Input_Login {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface I_Input_CheckAuth {
  token: string;
}
export interface I_Input_CheckToken {
  token: string;
}

export interface I_Input_Register {
  fullName: string;
  email: string;
  password: string;
  role: E_Role;
}
export interface I_Response_Auth {
  success: boolean;
  message?: string;
  result?: {
      user?: I_User;
      token?: string;
  };
}