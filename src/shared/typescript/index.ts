export * from './config';
export * from './express'

export interface I_BaseAttributes {
  id: string;
  isDel?: boolean;
  created_at?: Date;
  updated_at?: Date;
}