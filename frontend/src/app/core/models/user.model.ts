export type Role = 'CUSTOMER' | 'DRIVER' | 'ADMIN';

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  role: Role;
  avatarUrl?: string;
  createdAt?: string;
}

export interface AuthResponse {
  token: string;
  role: Role;
  userId: number;
  fullName: string;
}

export interface AuthRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  password: string;
  role: Role;
}
