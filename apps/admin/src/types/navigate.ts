export type __NavigateFn = (opts: {
  search:
    | true
    | Record<string, unknown>
    | ((prev: Record<string, unknown>) => Partial<Record<string, unknown>> | Record<string, unknown>)
  replace?: boolean
}) => void
