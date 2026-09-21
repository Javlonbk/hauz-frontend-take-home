import { queryOptions } from '@tanstack/react-query'

import { getViewer } from '#/server'

export function viewerQueryOptions() {
  return queryOptions({
    queryKey: ['viewer'],
    queryFn: () => getViewer(),
  })
}
