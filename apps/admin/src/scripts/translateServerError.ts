const errorMap: Record<number, string> = {
  400: 'errors.bad_request',
  401: 'errors.unauthorized',
  403: 'errors.forbidden',
  404: 'errors.not_found',
  409: 'errors.conflict',
  429: 'errors.too_many_requests',
  500: 'errors.internal_server_error',
}

export function __TranslateServerError(status: number): string {
  return errorMap[status] || 'errors.unknown'
}
