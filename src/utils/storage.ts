const TOKEN_KEY = 'token'

export const getToken = () => {
  return uni.getStorageSync(TOKEN_KEY)
}

export const setToken = (token: string) => {
  uni.setStorageSync(TOKEN_KEY, token)
}

export const removeToken = () => {
  uni.removeStorageSync(TOKEN_KEY)
}
