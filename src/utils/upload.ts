import { baseURL, type ResponseType } from './request'
import { getToken } from './storage'
import { getUrl } from './url'

const timeout = 10000

export const uploadUrlFile = async <T>({
  url,
  name,
  filePath
}: {
  url: string
  name: string
  filePath: string
}): Promise<ResponseType<T> | undefined> => {
  try {
    const result = (await uni.uploadFile({
      url: getUrl(baseURL, url),
      header: {
        Authorization: getToken()
      },
      name,
      filePath,
      timeout
    })) as unknown as string

    const res = JSON.parse(result) as unknown as ResponseType<T>

    if (res.code !== 200) {
      uni.showToast({
        title: res.msg || '上传失败！',
        icon: 'error',
        mask: true
      })
    }

    return res
  } catch (err: any) {
    uni.showToast({
      title: err.message || '上传失败！',
      icon: 'error',
      mask: true
    })
  }
}
