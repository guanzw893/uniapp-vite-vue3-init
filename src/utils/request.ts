import { getToken, removeToken, getUrl } from '@/utils'

export const baseURL = import.meta.env.VITE_BASE_API
const timeout = 60000

console.log('baseURL ==> ', baseURL)

export type ResponseType<T = unknown> = {
  code: number
  msg: string
  data: T
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
        Authorization: 'Bearer ' + getToken()
      }
    }
  }
})

export const request = async <T = unknown>(
  url: string,
  method: Methods = 'GET',
  data?: Record<string, any>,
  config?: { header?: any; notLoading?: Boolean }
): Promise<ResponseType<T>> => {
  return new Promise<ResponseType<T>>((resolve, reject) => {
    if (!config?.notLoading) {
      // 显示加载框
      uni.showLoading({
        title: '加载中',
        mask: true
      })
    }

    const header: any = {}
    if (!url.includes('/login')) {
      header.Authorization = 'Bearer ' + getToken()
    }

    uni
      .request({
        url: getUrl(baseURL, url),
        method,
        data,
        header: { ...header, ...config?.header },
        timeout
      })
      .then((data) => {
        const res = data.data as ResponseType<T> & {
          status: number
          error: string
          userId?: string
          appId?: string
        }

        if (res.code === 401) {
          // 保证hideLoading之后执行
          setTimeout(() => {
            uni.showToast({
              title: res.msg || '请先登录！',
              icon: 'error',
              mask: true
            })
          }, 0)

          // 删除Token
          removeToken()

          reject(res)
        } else if (res.userId || res.appId) {
          resolve(res)
        } else if (res.code !== 200 || (res.status && res.status !== 200)) {
          // 保证hideLoading之后执行
          setTimeout(() => {
            uni.showToast({
              title: res.msg || res.error || '页面加载异常，请重试！',
              icon: 'error',
              mask: true
            })
          }, 0)
          reject(res)
        } else {
          resolve(res)
        }
      })
      .catch((err) => {
        // 保证hideLoading之后执行
        setTimeout(() => {
          uni.showToast({
            title: err.errMsg || '页面加载异常，请重试！',
            icon: 'error',
            mask: true
          })
        }, 0)
        reject(err)
      })
      .finally(() => {
        if (!config?.notLoading) {
          // 隐藏加载框
          uni.hideLoading()
        }
      })
  })
}
