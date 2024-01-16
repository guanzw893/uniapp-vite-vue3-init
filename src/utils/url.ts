export const getUrl = (base: string, url: string) => {
  return (
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url)
  )
}
