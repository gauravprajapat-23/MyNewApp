import { DepositPoint } from '../types/user';

// Map database response to frontend DepositPoint type
export function mapAgentToDepositPoint(agent: any): DepositPoint {
  return {
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
}

// Map array of agents
export function mapAgentsList(agents: any[]): DepositPoint[] {
  return agents.map(mapAgentToDepositPoint);
}
