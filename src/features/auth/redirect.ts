export function safeRedirect(value: string | undefined) {
  return value && /^\/(?![/\\])/.test(value) ? value : '/'
}
