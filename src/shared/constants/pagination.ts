export interface PaginationResult {
  totalDocs: number;
  limit: number;
  hasPrevPage: boolean;
  hasNextPage: boolean;
  page: number;
  totalPages: number;
  offset: number;
  prevPage: number | null;
  nextPage: number | null;
  pagingCounter: number;
}
