import { request } from '@/utils'

export const userLogin = () => {
  return request<string>('/user/login', 'GET')
}
