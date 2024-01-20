import { wechatPay } from '@/api'
import { useProvider } from '@/hooks'

interface PayInfo {
  outTradeNo: string
}

const pay = (params: PayInfo) => {
  return new Promise<any>(async (resolve, reject) => {
    const { data } = await wechatPay(params.outTradeNo)
    const provider = await useProvider().getPaymentProvider()
    uni.requestPayment({
      // @ts-ignore
      appId: data.appId,
      // @ts-ignore
      provider: provider[0],
      timeStamp: data.timeStamp,
      nonceStr: data.nonceStr,
      package: data.package,
      signType: data.signType,
      paySign: data.paySign,
      success: function (result) {
        resolve(result)
      },
      fail: function (error) {
        reject(error)
      }
    })
  })
}

export const usePayment = () => ({ pay })
