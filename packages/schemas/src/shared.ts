import z from 'zod'

export const HeadersSchema = z.record(z.string(), z.union([z.string(), z.array(z.string())])).optional().describe('Captured request headers')
