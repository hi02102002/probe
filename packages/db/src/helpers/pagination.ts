export interface PageLimitPaginationInput {
  page?: number
  limit?: number
}

export interface IndexSizePaginationInput {
  pageIndex?: number
  pageSize?: number
}

export interface OffsetLimitPaginationInput {
  offset?: number
  limit?: number
}

export type PaginationInput
  = | PageLimitPaginationInput
    | IndexSizePaginationInput
    | OffsetLimitPaginationInput
    | null
    | undefined

export interface PaginationOptions {
  /** Default page number (1-indexed). Defaults to 1. */
  defaultPage?: number
  /** Default page size / limit. Defaults to 10. */
  defaultLimit?: number
  /** Maximum allowable limit to prevent DDoS / memory exhaustion. Defaults to 100. */
  maxLimit?: number
}

export interface ResolvedPagination {
  /** 1-indexed page number */
  page: number
  /** Number of items per page */
  limit: number
  /** SQL OFFSET value: (page - 1) * limit */
  offset: number
}

export interface PaginationMeta {
  /** 1-indexed current page */
  page: number
  /** Items per page */
  limit: number
  /** Total matching records in database */
  totalCount: number
  /** Total available pages */
  totalPages: number
  /** Whether a previous page exists */
  hasPreviousPage: boolean
  /** Whether a next page exists */
  hasNextPage: boolean
}

export interface PaginatedResult<T> {
  items: T[]
  pagination: PaginationMeta
}

/**
 * Normalizes any pagination input format (page/limit, pageIndex/pageSize, offset/limit)
 * into a safe, bounded { page, limit, offset } for Drizzle .limit().offset().
 *
 * @example
 * ```ts
 * const { limit, offset, page } = resolvePagination(input.pagination, {
 *   defaultLimit: 10,
 *   maxLimit: 50,
 * })
 *
 * const rows = await db.select().from(table).limit(limit).offset(offset)
 * ```
 */
export function resolvePagination(
  input?: PaginationInput,
  options: PaginationOptions = {},
): ResolvedPagination {
  const defaultPage = Math.max(1, options.defaultPage ?? 1)
  const defaultLimit = Math.max(1, options.defaultLimit ?? 10)
  const maxLimit = Math.max(defaultLimit, options.maxLimit ?? 100)

  if (!input) {
    return {
      limit: defaultLimit,
      offset: (defaultPage - 1) * defaultLimit,
      page: defaultPage,
    }
  }

  // Determine limit / pageSize
  let rawLimit = defaultLimit
  if ('limit' in input && typeof input.limit === 'number' && input.limit > 0) {
    rawLimit = input.limit
  }
  else if ('pageSize' in input && typeof input.pageSize === 'number' && input.pageSize > 0) {
    rawLimit = input.pageSize
  }

  // Bound limit to [1, maxLimit]
  const limit = Math.min(Math.max(1, Math.floor(rawLimit)), maxLimit)

  // Determine page / offset
  let page = defaultPage
  if ('page' in input && typeof input.page === 'number' && input.page > 0) {
    page = Math.floor(input.page)
  }
  else if ('pageIndex' in input && typeof input.pageIndex === 'number' && input.pageIndex >= 0) {
    page = Math.floor(input.pageIndex) + 1
  }
  else if ('offset' in input && typeof input.offset === 'number' && input.offset >= 0) {
    page = Math.floor(input.offset / limit) + 1
  }

  const offset = (page - 1) * limit

  return { limit, offset, page }
}

/**
 * Computes pagination metadata (totalCount, totalPages, hasNextPage, hasPreviousPage).
 *
 * @example
 * ```ts
 * const meta = createPaginationMeta({
 *   totalCount: 42,
 *   page: 1,
 *   limit: 10,
 * })
 * ```
 */
export function createPaginationMeta({
  totalCount,
  page,
  limit,
}: {
  totalCount: number
  page: number
  limit: number
}): PaginationMeta {
  const safeTotal = Math.max(0, totalCount)
  const safeLimit = Math.max(1, limit)
  const safePage = Math.max(1, page)
  const totalPages = Math.max(1, Math.ceil(safeTotal / safeLimit))

  return {
    hasNextPage: safePage < totalPages,
    hasPreviousPage: safePage > 1,
    limit: safeLimit,
    page: safePage,
    totalCount: safeTotal,
    totalPages,
  }
}

/**
 * Wraps an array of items and pagination metadata into a structured PaginatedResult.
 *
 * @example
 * ```ts
 * return createPaginatedResult(rows, {
 *   totalCount: countResult?.count ?? 0,
 *   page,
 *   limit,
 * })
 * ```
 */
export function createPaginatedResult<T>(
  items: T[],
  metaParams: {
    totalCount: number
    page: number
    limit: number
  },
): PaginatedResult<T> {
  return {
    items,
    pagination: createPaginationMeta(metaParams),
  }
}
