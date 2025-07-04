/**
 * API Usage Examples with getAuthToken utility
 * This file demonstrates various ways to use the authentication utilities
 */

import { getAuthToken, createAuthHeaders, hasValidAuthToken } from './auth';

// Example 1: Basic fetch with manual token handling
export const fetchWithManualToken = async (url: string) => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error('Authentication token not available');
  }

  try {
    const response = await fetch(url, {
      headers: {
        'Authorization': token,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Example 2: Using createAuthHeaders helper (Recommended approach)
export const fetchWithAuthHeaders = async (url: string) => {
  const headers = createAuthHeaders();
  
  if (!headers) {
    throw new Error('Authentication token not available');
  }

  try {
    const response = await fetch(url, { headers });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error;
  }
};

// Example 3: POST request with body
export const postWithAuth = async (url: string, data: any) => {
  const headers = createAuthHeaders();
  
  if (!headers) {
    throw new Error('Authentication token not available');
  }

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('POST request failed:', error);
    throw error;
  }
};

// Example 4: Advanced API wrapper with retry logic
export const apiCallWithRetry = async (
  url: string, 
  options: RequestInit = {}, 
  maxRetries: number = 3
) => {
  let lastError: Error;

  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      // Check if we have a valid token before making the request
      if (!hasValidAuthToken()) {
        throw new Error('No valid authentication token available');
      }

      const headers = createAuthHeaders(options.headers as Record<string, string> || {});
      
      if (!headers) {
        throw new Error('Failed to create authentication headers');
      }

      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        // If unauthorized, don't retry
        if (response.status === 401) {
          throw new Error('Unauthorized - token may be expired');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      lastError = error as Error;
      console.warn(`Attempt ${attempt} failed:`, error);
      
      // If it's the last attempt or an auth error, don't retry
      if (attempt === maxRetries || lastError.message.includes('token')) {
        break;
      }
      
      // Wait before retrying (exponential backoff)
      await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempt) * 1000));
    }
  }

  throw lastError!;
};

// Example 5: Generic API service class
export class ApiService {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  private async makeRequest(endpoint: string, options: RequestInit = {}) {
    const headers = createAuthHeaders(options.headers as Record<string, string> || {});
    
    if (!headers) {
      throw new Error('Authentication token not available');
    }

    const url = `${this.baseUrl}${endpoint}`;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  async get(endpoint: string) {
    return this.makeRequest(endpoint, { method: 'GET' });
  }

  async post(endpoint: string, data: any) {
    return this.makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async put(endpoint: string, data: any) {
    return this.makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  async delete(endpoint: string) {
    return this.makeRequest(endpoint, { method: 'DELETE' });
  }
}

// Example 6: Axios-style interceptor (if using axios)
/*
import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'https://your-api-url.com',
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getAuthToken();
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Handle unauthorized - maybe redirect to login
      console.error('Unauthorized request - redirecting to login');
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export { apiClient };
*/

// Example usage in a React component:
/*
const MyComponent = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const loadData = async () => {
    if (!hasValidAuthToken()) {
      setError('Please log in to continue');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const result = await fetchWithAuthHeaders('/api/v1/data');
      setData(result);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  // Component JSX...
};
*/ 