import { I_BaseAttributes } from "#shared/typescript";

export enum E_Experience {
  UNDER_ONE_YEAR = 'Dưới 1 năm',
  ONE_TO_TWO_YEARS = '1-2 năm',
  TWO_TO_THREE_YEARS = '2-3 năm',
  THREE_TO_FOUR_YEARS = '3-4 năm',
  ABOVE_FIVE_YEARS = 'Trên 5 năm',
}

export interface I_CandidateProfile extends I_BaseAttributes {
  experience: E_Experience;
  userId: string;
}