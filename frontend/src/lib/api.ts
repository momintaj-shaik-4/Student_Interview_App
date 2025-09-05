import axios from 'axios'
import Cookies from 'js-cookie'
import toast from 'react-hot-toast'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = Cookies.get('access_token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token and redirect to login
      Cookies.remove('access_token')
      window.location.href = '/login'
      toast.error('Session expired. Please login again.')
    } else if (error.response?.data?.detail) {
      toast.error(error.response.data.detail)
    } else {
      toast.error('An error occurred. Please try again.')
    }
    return Promise.reject(error)
  }
)

// Auth API
export const authAPI = {
  register: (data: { name: string; email: string; password: string; city?: string }) =>
    api.post('/register', data),
  
  login: (data: { username: string; password: string }) =>
    api.post('/login', data, {
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      transformRequest: [(data) => {
        const params = new URLSearchParams()
        Object.entries(data).forEach(([key, value]) => {
          params.append(key, value as string)
        })
        return params
      }]
    }),
  
  googleLogin: () => {
    window.location.href = `${API_BASE_URL}/google`
  },
  
  getProfile: () => api.get('/profile'),
}

// Placeholder APIs for future backend endpoints
export const rolesAPI = {
  getRoles: () => api.get('/api/v1/roles'),
  getUserRoles: () => api.get('/api/v1/my/roles'),
  selectRole: (roleId: string) => api.post('/api/v1/my/roles', { role_id: roleId }),
}

export const cvsAPI = {
  getCVs: () => api.get('/api/v1/cvs'),
  uploadCV: (data: FormData) => api.post('/api/v1/cvs/upload', data, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  deleteCV: (id: string) => api.delete(`/api/v1/cvs/${id}`),
}

export const walletAPI = {
  getWallet: () => api.get('/api/v1/wallet'),
  getTransactions: () => api.get('/api/v1/transactions'),
  createPaymentOrder: (packId: string) => api.post('/api/v1/payments/order', { pack_id: packId }),
}

export const interviewAPI = {
  startInterview: (data: { role_id: string; cv_id?: string }) => 
    api.post('/api/v1/interviews/start', data),
  
  runScreening: (data: { cv_id: string }) => 
    api.post('/api/v1/screenings/run', data),
}

export const personaAPI = {
  getPersona: () => api.get('/api/v1/personas/current'),
  computePersona: () => api.post('/api/v1/personas/compute'),
}
