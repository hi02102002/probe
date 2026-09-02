import type { AnyColumn, Column, SQL, SQLWrapper } from 'drizzle-orm'
import { asc, desc, isSQLWrapper, SQL as SQLClass } from 'drizzle-orm'

export type SortOrder = 'asc' | 'desc' | 'ASC' | 'DESC'

export type SortDescriptor<TKey extends string = string>
  = | { by: TKey, order?: SortOrder }
    | { field: TKey, order?: SortOrder }
    | { id: TKey, desc?: boolean }
    | { column: TKey, order?: SortOrder }
    | TKey

export type SortInput<TKey extends string = string>
  = | SortDescriptor<TKey>
    | Array<SortDescriptor<TKey>>
    | null
    | undefined

export type ColumnSortTarget = AnyColumn | Column | SQL | SQLWrapper

export type ColumnSortMap<TKey extends string = string> = {
  [K in TKey]: ColumnSortTarget
}

export interface ParsedSort<TKey extends string = string> {
  key: TKey
  isDesc: boolean
}

/**
 * Parses a single sort descriptor into normalized { key, isDesc }.
 */
export function parseSortDescriptor<TKey extends string>(
  descriptor: SortDescriptor<TKey>,
): ParsedSort<TKey> | null {
  if (typeof descriptor === 'string') {
    if (descriptor.startsWith('-')) {
      return { key: descriptor.slice(1) as TKey, isDesc: true }
    }
    if (descriptor.startsWith('+')) {
      return { key: descriptor.slice(1) as TKey, isDesc: false }
    }
    const [field, dir] = descriptor.split(/[.:]/)
    if (!field)
      return null
    const isDesc = dir?.toLowerCase() === 'desc'
    return { key: field as TKey, isDesc }
  }

  if (typeof descriptor === 'object' && descriptor !== null) {
    if ('desc' in descriptor && typeof descriptor.desc === 'boolean') {
      const key = (descriptor.id ?? (descriptor as { by?: string }).by ?? (descriptor as { field?: string }).field) as TKey
      return key ? { key, isDesc: descriptor.desc } : null
    }

    const targetObj = descriptor as Record<string, unknown>
    const key = (targetObj.by ?? targetObj.field ?? targetObj.id ?? targetObj.column) as TKey
    const order = targetObj.order as string | undefined
    const isDesc = order?.toLowerCase() === 'desc'
    return key ? { key, isDesc } : null
  }

  return null
}

function isSqlExpression(value: unknown): value is SQL {
  return value instanceof SQLClass || isSQLWrapper(value)
}

/**
 * Maps a sort input ({ by: 'name', order: 'asc' } or [{ id: 'name', desc: false }])
 * to an array of Drizzle SQL order-by clauses (e.g. [asc(endpoint.name)]).
 *
 * @example
 * ```ts
 * const orderBy = mapSort(input.sort, {
 *   name: endpoint.name,
 *   createdAt: endpoint.createdAt,
 * }, asc(endpoint.name))
 *
 * db.select().from(endpoint).orderBy(...orderBy)
 * ```
 */
export function mapSort<TKey extends string>(
  sort: SortInput<TKey>,
  columnMap: ColumnSortMap<TKey>,
  defaultOrder?: ColumnSortTarget | ColumnSortTarget[],
): SQL[] {
  const normalizeDefault = (item: ColumnSortTarget): SQL => {
    return isSqlExpression(item) ? (item as SQL) : asc(item as AnyColumn)
  }

  const defaultList: SQL[] = defaultOrder
    ? Array.isArray(defaultOrder)
      ? defaultOrder.map(normalizeDefault)
      : [normalizeDefault(defaultOrder)]
    : []

  if (!sort) {
    return defaultList
  }

  const descriptors: Array<SortDescriptor<TKey>> = Array.isArray(sort) ? sort : [sort]
  const orderByList: SQL[] = []

  for (const descItem of descriptors) {
    const parsed = parseSortDescriptor(descItem)
    if (!parsed)
      continue

    const target = columnMap[parsed.key]
    if (!target)
      continue

    const orderExpr = parsed.isDesc
      ? desc(target as AnyColumn)
      : asc(target as AnyColumn)

    orderByList.push(orderExpr)
  }

  return orderByList.length > 0 ? orderByList : defaultList
}

/**
 * Creates a reusable sort mapper function for a given column mapping and default order.
 *
 * @example
 * ```ts
 * const resolveSort = createSortMapper({
 *   name: endpoint.name,
 *   createdAt: endpoint.createdAt,
 * }, [asc(endpoint.name)])
 *
 * db.select().from(endpoint).orderBy(...resolveSort(input.sort))
 * ```
 */
export function createSortMapper<TKey extends string>(
  columnMap: ColumnSortMap<TKey>,
  defaultOrder?: ColumnSortTarget | ColumnSortTarget[],
) {
  return (sort: SortInput<TKey>): SQL[] => mapSort(sort, columnMap, defaultOrder)
}
