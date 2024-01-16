import { request } from '@/utils'

export const userLogin = (params: { username: string; password: string }) => {
  return request<string>('/user/login', 'POST', params)
}
