export function filterByServices(agents: any[], services: string[]) {
  if (services.length === 0) return agents;
  
  return agents.filter(agent => 
    services.some(service => agent.services.includes(service))
  );
}

export function filterByStatus(agents: any[], status: string | null) {
  if (!status || status === 'all') return agents;
  
  return agents.filter(agent => agent.status === status);
}

export function searchAgents(agents: any[], query: string) {
  if (!query.trim()) return agents;
  
  const lowerQuery = query.toLowerCase();
  
  return agents.filter(agent =>
    agent.name.toLowerCase().includes(lowerQuery) ||
    agent.type.toLowerCase().includes(lowerQuery) ||
    agent.address.toLowerCase().includes(lowerQuery) ||
    agent.services.some((service: string) => service.toLowerCase().includes(lowerQuery))
  );
}

export function applyFilters(
  agents: any[],
  filters: {
    services: string[];
    status: string | null;
    maxDistance: number;
    sortBy: 'distance' | 'rating' | 'commission';
    searchQuery: string;
  }
) {
  let filtered = [...agents];
  
  // Apply search
  if (filters.searchQuery) {
    filtered = searchAgents(filtered, filters.searchQuery);
  }
  
  // Apply service filter
  if (filters.services.length > 0) {
    filtered = filterByServices(filtered, filters.services);
  }
  
  // Apply status filter
  if (filters.status && filters.status !== 'all') {
    filtered = filterByStatus(filtered, filters.status);
  }
  
  // Apply distance filter
  if (filters.maxDistance > 0) {
    filtered = filterByDistance(filtered, filters.maxDistance);
  }
  
  // Apply sorting
  filtered = sortAgents(filtered, filters.sortBy);
  
  return filtered;
}

// Import from location.ts
function filterByDistance(agents: any[], maxDistance: number) {
  return agents.filter(agent => agent.distance <= maxDistance);
}

function sortAgents(agents: any[], sortBy: 'distance' | 'rating' | 'commission') {
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
