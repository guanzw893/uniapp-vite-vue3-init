export const getUrl = (base: string, url: string) => {
  return (
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url)
  )
}

export const getWebViewUrl = (url: string) => {
  return getUrl(import.meta.env.VITE_WEBVIEW_URL, url)
}
