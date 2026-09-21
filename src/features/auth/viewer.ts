import { queryOptions } from '@tanstack/react-query'

import { getViewer } from '#/server/auth'

export function viewerQueryOptions() {
  return queryOptions({
    queryKey: ['viewer'],
    queryFn: () => getViewer(),
  })
}
