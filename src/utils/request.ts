import { getToken, removeToken } from '@/utils/storage'

const baseURL = import.meta.env.VITE_BASE_API

console.log('baseURL ==> ', baseURL)

type ResponseType<T = unknown> = {
  code?: number
  msg?: string
  data?: T
}

type Methods =
  | 'OPTIONS'
  | 'GET'
  | 'HEAD'
  | 'POST'
  | 'PUT'
  | 'DELETE'
  | 'TRACE'
  | 'CONNECT'

uni.addInterceptor('request', {
  invoke(res) {
    if (!res.url.includes('/login')) {
      res.header = {
        ...res.header,
        Authorization: 'Bearer ' + (getToken() ?? '')
      }
    }
    uni.showLoading({
      title: '加载中',
      mask: true
    })
  },
  success(res: { data: ResponseType }) {
    if (res.data.code === 401) {
      uni.showToast({
        title: res.data.msg || '页面加载异常，请重试！',
        icon: 'error',
        mask: true
      })
      // 删除 Token
      removeToken()
      // 跳转登录页
      uni.navigateTo({
        url: '/login'
      })
    } else if (res.data.code !== 200) {
      uni.showToast({
        title: res.data.msg || '页面加载异常，请重试！',
        icon: 'error',
        mask: true
      })
    }
  },
  fail(res: { data: ResponseType }) {
    uni.showToast({
      title: res.data?.msg || '页面加载异常，请重试！',
      icon: 'error',
      mask: true
    })
  },
  complete() {
    uni.hideLoading()
  }
})

uni.addInterceptor({
  returnValue(res) {
    return res.then((r: any) => r.data)
  }
})

const getUrl = (base: string, url: string) => {
  return (
    (base.endsWith('/') ? base.slice(0, -1) : base) +
    '/' +
    (url.startsWith('/') ? url.slice(1) : url)
  )
}

const request = async <T = unknown>(
  url: string,
  method: Methods,
  data?: Record<string, any>,
  header?: any
): Promise<ResponseType<T>> => {
  if (method === 'GET') {
    const us: string[] = []
    for (const key in data) {
      if (Array.isArray(data[key])) {
        data[key].map((item: any) => us.push(`${key}=${item}`))
      } else {
        us.push(`${key}=${data[key]}`)
      }
    }
    url += '?' + us.join('&')
  }

  return (await uni.request({
    url: getUrl(baseURL, url),
    method,
    data,
    header
  })) as unknown as ResponseType<T>
}

export default request
