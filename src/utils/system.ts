export const uniPlatform = uni.getSystemInfoSync().uniPlatform

export const isH5 = uniPlatform === 'web'

export const isWx = uniPlatform === 'mp-weixin'
