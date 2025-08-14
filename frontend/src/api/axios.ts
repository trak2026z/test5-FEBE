// src/api/axios.ts
import axios from 'axios'

const baseURL =
  import.meta.env.VITE_API_URL ??
  (import.meta.env.DEV ? 'http://localhost:3000/api' : '/api')

export default axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' },
})
