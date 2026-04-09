import { DepositPoint } from '../types/user';

// Map database response to frontend DepositPoint type
export function mapAgentToDepositPoint(agent: any): DepositPoint {
  try {
    console.log('[Mapper] Mapping agent:', agent.id, agent.name);
    
    const mapped = {
      id: agent.id.toString(),
      name: agent.name,
      type: agent.type,
      services: agent.services || [],
      rating: parseFloat(agent.rating) || 0,
      reviews: agent.reviews_count || 0,
      distance: agent.distance ? parseFloat(agent.distance) : 0,
      commission: agent.commission_rate,
      status: agent.status || 'open',
      operatingHours: agent.operating_hours,
      phone: agent.phone,
      address: agent.address,
      latitude: parseFloat(agent.latitude),
      longitude: parseFloat(agent.longitude),
      isFavorite: false,
      description: agent.description,
    };
    
    console.log('[Mapper] Successfully mapped agent:', mapped.id, 'at', mapped.latitude, mapped.longitude);
    return mapped;
  } catch (error) {
    console.error('[Mapper] Error mapping agent:', error, agent);
    throw error;
  }
}

// Map array of agents
export function mapAgentsList(agents: any[]): DepositPoint[] {
  console.log('[Mapper] Mapping agents list, count:', agents.length);
  try {
    const mapped = agents.map(mapAgentToDepositPoint);
    console.log('[Mapper] Successfully mapped', mapped.length, 'agents');
    return mapped;
  } catch (error) {
    console.error('[Mapper] Error mapping agents list:', error);
    throw error;
  }
}
