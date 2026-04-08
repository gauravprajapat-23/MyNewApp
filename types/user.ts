export interface DepositPoint {
  id: string;
  name: string;
  type: string;
  services: string[];
  rating: number;
  reviews: number;
  distance: number;
  commission: string;
  status: 'open' | 'closed' | 'busy';
  operatingHours: string;
  phone: string;
  address: string;
  latitude: number;
  longitude: number;
  isFavorite: boolean;
  images?: string[];
  description?: string;
}

export interface FilterOptions {
  services: string[];
  status: string | null;
  maxDistance: number;
  sortBy: 'distance' | 'rating' | 'commission';
  searchQuery: string;
}

export interface SortOption {
  label: string;
  value: 'distance' | 'rating' | 'commission';
  icon: string;
}

export interface User {
  id: number;
  phone: string;
  full_name: string;
  email?: string;
  is_agent: boolean;
  created_at?: string;
  updated_at?: string;
}

export interface UserContextType {
  isGuest: boolean;
  userId: number | null;
  favorites: string[];
  addFavorite: (id: string) => Promise<void>;
  removeFavorite: (id: string) => Promise<void>;
  isFavorite: (id: string) => boolean;
  searchHistory: string[];
  addToSearchHistory: (query: string) => void;
  loginUser: (phone: string, fullName: string, email?: string) => Promise<void>;
  logoutUser: () => Promise<void>;
}
