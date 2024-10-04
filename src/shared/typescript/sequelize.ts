
export interface I_FindPaging {
  where?: any
  orderBy?: any
  page?: number;
  pageSize?: number;
  isPagination?: boolean | true;
}

export interface I_FindOne {
  where?: any
  orderBy?: any
}