import apiClient from './axios'

export interface User {
  id: number
  name: string
  email: string
}

export const getUsers = () => apiClient.get<User[]>('/users')
export const getUser = (id: number) => apiClient.get<User>(`/users/${id}`)
export const createUser = (user: Partial<User>) => apiClient.post<User>('/users', user)
export const updateUser = (id: number, user: Partial<User>) =>  apiClient.patch<User>(`/users/${id}`, user)
export const deleteUser = (id: number) => apiClient.delete(`/users/${id}`)
