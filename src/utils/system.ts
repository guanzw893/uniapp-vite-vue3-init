export const uniPlatform = uni.getSystemInfoSync().uniPlatform

export const isH5 = uniPlatform === 'web'
