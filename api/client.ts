import { API_CONFIG } from './config';

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  count?: number;
}

class ApiError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

async function fetchWithTimeout(url: string, options: RequestInit = {}, timeout = API_CONFIG.TIMEOUT) {
  const controller = new AbortController();
  const { signal } = controller;

  const timeoutId = setTimeout(() => controller.abort(), timeout);

  try {
    const response = await fetch(url, {
      ...options,
      signal,
      headers: {
        ...API_CONFIG.HEADERS,
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ApiError(408, 'Request timeout. Please check your connection.');
    }
    throw error;
  }
}

export async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_CONFIG.BASE_URL}${endpoint}`;
  console.log('[API] Request:', url, options.method || 'GET');
  
  try {
    const response = await fetchWithTimeout(url, options);
    console.log('[API] Response status:', response.status);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error('[API] Error response:', response.status, errorData);
      throw new ApiError(
        response.status,
        errorData.error || `HTTP error! status: ${response.status}`
      );
    }

    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      console.error('[API] Invalid content type:', contentType);
      throw new ApiError(500, 'Invalid response format from server');
    }

    const data: ApiResponse<T> = await response.json();
    console.log('[API] Response success:', data.success, 'count:', data.count);

    if (!data.success) {
      console.error('[API] Request failed:', data.error);
      throw new ApiError(500, data.error || 'API request failed');
    }

    // Handle empty or missing data
    if (data.data === undefined || data.data === null) {
      console.warn('[API] No data in response, returning empty array');
      return [] as unknown as T;
    }

    return data.data as T;
  } catch (error) {
    console.error('[API] Request error:', error);
    if (error instanceof ApiError) {
      throw error;
    }

    if (error instanceof Error) {
      if (error.message.includes('Network request failed')) {
        console.error('[API] Network error - check if backend is running and accessible');
        throw new ApiError(0, 'Network error. Please check your internet connection.');
      }
      throw new ApiError(500, error.message);
    }

    throw new ApiError(500, 'An unexpected error occurred');
  }
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof ApiError) {
    return error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return 'An unexpected error occurred';
}
