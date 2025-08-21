export interface User {
  id: number
  name: string
  email: string
  city?: string
}

export interface AuthResponse {
  access_token: string
  token_type: string
  user?: User
  message?: string
}

export interface Role {
  id: string
  title: string
  description: string
  tags: string[]
  is_active: boolean
}

export interface CV {
  id: string
  user_id: string
  role_id?: string
  filename: string
  mime_type: string
  size_bytes: number
  storage_url: string
  status: 'uploaded' | 'parsed'
  created_at: string
}

export interface Wallet {
  user_id: string
  balance_credits: number
  updated_at: string
}

export interface Transaction {
  id: string
  user_id: string
  type: 'purchase' | 'deduct' | 'refund' | 'adjust'
  credits: number
  amount_inr?: number
  currency?: string
  payment_gateway?: string
  external_ref?: string
  status: 'created' | 'success' | 'failed'
  created_at: string
}

export interface Payment {
  id: string
  user_id: string
  order_id: string
  amount_inr: number
  currency: string
  status: string
  method: string
  created_at: string
}

export interface Persona {
  id: string
  user_id: string
  summary: Record<string, any>
  skills: string[]
  updated_at: string
}

export interface Interview {
  id: string
  user_id: string
  role_id: string
  cv_id?: string
  status: 'pending' | 'in_progress' | 'done' | 'failed'
  credits_used: number
  created_at: string
}

export interface Screening {
  id: string
  user_id: string
  cv_id: string
  status: 'pending' | 'done' | 'failed'
  credits_used: number
  created_at: string
}

export interface CreditPack {
  id: string
  name: string
  credits: number
  price_inr: number
  description: string
}
