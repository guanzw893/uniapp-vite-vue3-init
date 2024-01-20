import { useProvider } from '@/hooks'

const getUserInfo = () => {
  return new Promise<UniApp.UserInfo>(async (resolve, reject) => {
    const provider = await useProvider().getOauthProvider()
    if (uni.canIUse('getUserProfile')) {
      uni.getUserProfile({
        // @ts-ignore
        provider: provider[0],
        desc: '用于完善会员资料',
        success(res) {
          resolve(res.userInfo)
        },
        fail(err) {
          reject(err)
        }
      })
    } else {
      uni.getUserInfo({
        // @ts-ignore
        provider: provider[0],
        success(res) {
          resolve(res.userInfo)
        },
        fail(err) {
          reject(err)
        }
      })
    }
  })
}

export const useUser = () => ({ getUserInfo })
