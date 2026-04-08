import { apiRequest } from './client';

export interface User {
  id: number;
  phone: string;
  full_name: string;
  email?: string;
  is_agent: boolean;
  created_at: string;
  updated_at: string;
}

// Login or create user
export async function loginOrCreateUser(
  phone: string,
  fullName: string,
  email?: string,
  isAgent: boolean = false
): Promise<User> {
  return apiRequest<User>('/users/login', {
    method: 'POST',
    body: JSON.stringify({
      phone,
      fullName,
      email,
      isAgent,
    }),
  });
}

// Fetch user by ID
export async function fetchUserById(id: number): Promise<User> {
  return apiRequest<User>(`/users/${id}`);
}

// Update user
export async function updateUser(
  id: number,
  data: {
    full_name?: string;
    email?: string;
    is_agent?: boolean;
  }
): Promise<User> {
  return apiRequest<User>(`/users/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
