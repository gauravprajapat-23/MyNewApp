export function formatDistance(km: number): string {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)} km`;
}

export function filterByDistance(agents: any[], maxDistance: number) {
  return agents.filter(agent => agent.distance <= maxDistance);
}

export function sortAgents(agents: any[], sortBy: 'distance' | 'rating' | 'commission') {
  const sorted = [...agents];
  
  switch (sortBy) {
    case 'distance':
      return sorted.sort((a, b) => a.distance - b.distance);
    case 'rating':
      return sorted.sort((a, b) => b.rating - a.rating);
    case 'commission':
      return sorted.sort((a, b) => {
        const commissionA = parseFloat(a.commission.replace('%', ''));
        const commissionB = parseFloat(b.commission.replace('%', ''));
        return commissionB - commissionA;
      });
    default:
      return sorted;
  }
}
