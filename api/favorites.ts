import { apiRequest } from './client';
import { DepositPoint } from '../types/user';
import { mapAgentsList } from './mappers';

// Fetch user's favorites
export async function fetchUserFavorites(userId: number): Promise<DepositPoint[]> {
  const data = await apiRequest<any[]>(`/favorites/user/${userId}`);
  return mapAgentsList(data);
}

// Add to favorites
export async function addFavorite(userId: number, agentId: number): Promise<void> {
  await apiRequest('/favorites', {
    method: 'POST',
    body: JSON.stringify({ user_id: userId, agent_id: agentId }),
  });
}

// Remove from favorites
export async function removeFavorite(userId: number, agentId: number): Promise<void> {
  await apiRequest(`/favorites/${userId}/${agentId}`, {
    method: 'DELETE',
  });
}

// Check if agent is favorited
export async function checkFavoriteStatus(
  userId: number,
  agentId: number
): Promise<boolean> {
  const response = await apiRequest<{ is_favorite: boolean }>(
    `/favorites/check/${userId}/${agentId}`
  );
  return response.is_favorite;
}
