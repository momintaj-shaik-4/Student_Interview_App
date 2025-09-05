// import { useState, useEffect } from 'react'
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
// import Cookies from 'js-cookie'
// import toast from 'react-hot-toast'
// import { authAPI } from '@/lib/api'
// import { User, AuthResponse } from '@/types'

// export function useAuth() {
//   const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false)
//   const queryClient = useQueryClient()

//   useEffect(() => {
//     const token = Cookies.get('access_token')
//     setIsAuthenticated(!!token)
//   }, [])

//   const { data: user, isLoading } = useQuery({
//     queryKey: ['user'],
//     queryFn: async () => {
//       const response = await authAPI.getProfile()
//       return response.data as User
//     },
//     enabled: isAuthenticated,
//     retry: false,
//   })

//   const loginMutation = useMutation({
//     mutationFn: authAPI.login,
//     onSuccess: (response) => {
//       const data = response.data as AuthResponse
//       Cookies.set('access_token', data.access_token, { expires: 7 })
//       setIsAuthenticated(true)
//       queryClient.invalidateQueries({ queryKey: ['user'] })
//       toast.success('Login successful!')
//     },
//     onError: () => {
//       toast.error('Login failed. Please check your credentials.')
//     },
//   })

//   const registerMutation = useMutation({
//     mutationFn: authAPI.register,
//     onSuccess: () => {
//       toast.success('Registration successful! Please login.')
//     },
//     onError: () => {
//       toast.error('Registration failed. Please try again.')
//     },
//   })

//   const logout = () => {
//     Cookies.remove('access_token')
//     setIsAuthenticated(false)
//     queryClient.clear()
//     toast.success('Logged out successfully!')
//   }

//   const login = (credentials: { username: string; password: string }) => {
//     loginMutation.mutate(credentials)
//   }

//   const register = (userData: { name: string; email: string; password: string; city?: string }) => {
//     registerMutation.mutate(userData)
//   }

//   return {
//     user,
//     isAuthenticated,
//     isLoading: isLoading || loginMutation.isPending || registerMutation.isPending,
//     login,
//     register,
//     logout,
//     loginError: loginMutation.error,
//     registerError: registerMutation.error,
//   }
// }
