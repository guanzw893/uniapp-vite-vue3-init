export enum Provider {
  Oauth = 'oauth',
  Share = 'share',
  Payment = 'payment',
  Push = 'push'
}

const getProvider = (provider: Provider) => {
  return new Promise<UniApp.GetProviderRes['provider']>((resolve, reject) => {
    uni.getProvider({
      service: provider,
      success(res) {
        resolve(res.provider)
      },
      fail(err) {
        uni.showToast({
          title: '获取通道失败',
          icon: 'none'
        })
        reject(err)
      }
    })
  })
}

const getPaymentProvider = () => {
  return getProvider(Provider.Payment)
}

const getOauthProvider = () => {
  return getProvider(Provider.Oauth)
}

export const useProvider = () => ({
  getProvider,
  getPaymentProvider,
  getOauthProvider
})
