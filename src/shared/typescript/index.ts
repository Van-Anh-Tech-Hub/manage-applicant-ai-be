export * from './config';
export * from './express';
export * from './log';
export * from './sequelize';
export interface I_BaseAttributes {
  id?: string;
  isDel?: boolean;
  created_at?: Date;
  updated_at?: Date;
}

export interface I_Return<D> {
  success: boolean;
  result?: D;
  message?: string;
}
export interface T_PaginateResult<D> {
  success: boolean;
  result?: {
    docs?: D[];
    totalDocs?: number;
    limit?: number;
    hasPrevPage?: boolean;
    hasNextPage?: boolean;
    page?: number;
    totalPages?: number;
    offset?: number;
    prevPage?: number;
    nextPage?: number;
    pagingCounter?: number;
  };
  message?: string;
}