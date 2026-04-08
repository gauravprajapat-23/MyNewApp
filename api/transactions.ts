import { apiRequest } from './client';

export interface Transaction {
  id: number;
  user_id?: number;
  agent_id: number;
  type: string;
  amount: number;
  commission: number;
  status: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  created_at: string;
  updated_at: string;
  agent_name?: string;
  user_name?: string;
}

export interface TransactionData {
  user_id?: number;
  agent_id: number;
  type: string;
  amount: number;
  commission: number;
  status?: 'pending' | 'completed' | 'failed' | 'cancelled';
  description?: string;
  metadata?:{[key:string]:any}
  
}

// Create a new transaction
export async function createTransaction(data: TransactionData): Promise<Transaction> {
  return apiRequest<Transaction>('/transactions', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

// Fetch all transactions
export async function fetchTransactions(filters?: {
  status?: string;
  type?: string;
  limit?: number;
  offset?: number;
}): Promise<Transaction[]> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.type) params.append('type', filters.type);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const queryString = params.toString();
  const endpoint = `/transactions${queryString ? `?${queryString}` : ''}`;

  return apiRequest<Transaction[]>(endpoint);
}

// Fetch user's transactions
export async function fetchUserTransactions(
  userId: number,
  limit?: number,
  offset?: number
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  if (limit) params.append('limit', limit.toString());
  if (offset) params.append('offset', offset.toString());

  const queryString = params.toString();
  const endpoint = `/transactions/user/${userId}${queryString ? `?${queryString}` : ''}`;

  return apiRequest<Transaction[]>(endpoint);
}

// Fetch agent's transactions
export async function fetchAgentTransactions(
  agentId: number,
  filters?: {
    status?: string;
    limit?: number;
    offset?: number;
  }
): Promise<Transaction[]> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const queryString = params.toString();
  const endpoint = `/transactions/agent/${agentId}${queryString ? `?${queryString}` : ''}`;

  return apiRequest<Transaction[]>(endpoint);
}

// Update transaction status
export async function updateTransactionStatus(
  transactionId: number,
  status: 'pending' | 'completed' | 'failed' | 'cancelled'
): Promise<Transaction> {
  return apiRequest<Transaction>(`/transactions/${transactionId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
}

// Fetch transaction by ID
export async function fetchTransactionById(id: number): Promise<Transaction> {
  return apiRequest<Transaction>(`/transactions/${id}`);
}
