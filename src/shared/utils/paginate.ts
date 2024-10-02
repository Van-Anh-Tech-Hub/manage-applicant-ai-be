import { PaginationResult } from "#shared/constants";

export const paginate = (totalDocs: number, page: number = 1, limit: number = 10): PaginationResult => {
  const totalPages = Math.ceil(totalDocs / limit);
  const hasNextPage = page < totalPages;
  const hasPrevPage = page > 1;
  const nextPage = hasNextPage ? page + 1 : null;
  const prevPage = hasPrevPage ? page - 1 : null;
  const offset = (page - 1) * limit;
  const pagingCounter = offset + 1;

  return {
    totalDocs,
    limit,
    hasPrevPage,
    hasNextPage,
    page,
    totalPages,
    offset,
    prevPage,
    nextPage,
    pagingCounter,
  };
}