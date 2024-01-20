const getEnv = (): { USER_DATA_PATH: string } => {
  if (uni.canIUse('getEnvInfoSync')) {
    return uni.getEnvInfoSync().common
  }
  return uni.env
}

const getUserDataPath = () => {
  return getEnv().USER_DATA_PATH
}

export const useEnv = () => ({ getEnv, getUserDataPath })
