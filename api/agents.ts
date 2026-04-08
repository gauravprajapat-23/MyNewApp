import { apiRequest } from './client';
import { DepositPoint } from '../types/user';
import { mapAgentToDepositPoint, mapAgentsList } from './mappers';

// Fetch all agents with optional filters
export async function fetchAgents(filters?: {
  status?: string;
  services?: string[];
  sortBy?: string;
  limit?: number;
  offset?: number;
}): Promise<DepositPoint[]> {
  const params = new URLSearchParams();
  
  if (filters?.status) params.append('status', filters.status);
  if (filters?.services) params.append('services', filters.services.join(','));
  if (filters?.sortBy) params.append('sortBy', filters.sortBy);
  if (filters?.limit) params.append('limit', filters.limit.toString());
  if (filters?.offset) params.append('offset', filters.offset.toString());

  const queryString = params.toString();
  const endpoint = `/agents${queryString ? `?${queryString}` : ''}`;

  const data = await apiRequest<any[]>(endpoint);
  return mapAgentsList(data);
}

// Search agents by query
export async function searchAgentsApi(query: string): Promise<DepositPoint[]> {
  const data = await apiRequest<any[]>(`/agents/search/${encodeURIComponent(query)}`);
  return mapAgentsList(data);
}

// Fetch nearby agents by location
export async function fetchNearbyAgents(
  lat: number,
  lng: number,
  radius?: number
): Promise<DepositPoint[]> {
  const params = new URLSearchParams();
  if (radius) params.append('radius', radius.toString());
  
  const queryString = params.toString();
  const endpoint = `/agents/nearby/${lat}/${lng}${queryString ? `?${queryString}` : ''}`;

  const data = await apiRequest<any[]>(endpoint);
  return mapAgentsList(data);
}

// Fetch single agent by ID
export async function fetchAgentById(id: string): Promise<DepositPoint> {
  const data = await apiRequest<any>(`/agents/${id}`);
  return mapAgentToDepositPoint(data);
}

// Update agent status
export async function updateAgentStatus(
  agentId: string,
  status: 'open' | 'closed' | 'busy'
): Promise<DepositPoint> {
  const data = await apiRequest<any>(`/agents/${agentId}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status }),
  });
  return mapAgentToDepositPoint(data);
}
