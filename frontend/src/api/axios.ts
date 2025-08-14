import axios from 'axios'

const apiClient = axios.create({
  baseURL: 'http://localhost:3000', // zakładamy że NestJS wystawia API pod tym adresem
  headers: {
    'Content-Type': 'application/json',
  },
})

export default apiClient
