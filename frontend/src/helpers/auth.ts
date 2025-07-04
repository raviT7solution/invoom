/**
 * Authentication utilities for token management
 */

interface SessionData {
  state: {
    token: string;
  };
  version: number;
}

/**
 * Retrieves the authentication token from localStorage
 * @returns {string | null} The JWT token with Bearer prefix, or null if not found/invalid
 */
export const getAuthToken = (): string | null => {
  try {
    // Get the session data from localStorage
    const sessionData = localStorage.getItem('session-store');
    
    if (!sessionData) {
      console.warn('No session data found in localStorage');
      return null;
    }

    // Parse the JSON data
    const parsedData: SessionData = JSON.parse(sessionData);
    
    // Validate the structure and extract token
    if (!parsedData?.state?.token) {
      console.warn('Invalid session data structure - token not found');
      return null;
    }

    const token = parsedData.state.token;
    
    // Basic token validation (check if it's not empty and looks like a JWT)
    if (typeof token !== 'string' || token.trim().length === 0) {
      console.warn('Invalid token format');
      return null;
    }

    // Return token with Bearer prefix if not already present
    return token.startsWith('Bearer ') ? token : `Bearer ${token}`;
    
  } catch (error) {
    console.error('Error retrieving auth token from localStorage:', error);
    return null;
  }
};

/**
 * Checks if a valid authentication token exists
 * @returns {boolean} True if a valid token exists, false otherwise
 */
export const hasValidAuthToken = (): boolean => {
  return getAuthToken() !== null;
};

/**
 * Removes the authentication token from localStorage
 * This can be used for logout functionality
 */
export const clearAuthToken = (): void => {
  try {
    localStorage.removeItem('session-store');
  } catch (error) {
    console.error('Error clearing auth token:', error);
  }
};

/**
 * Creates headers object with authorization token for API calls
 * @param {Record<string, string>} additionalHeaders - Additional headers to include
 * @returns {Record<string, string> | null} Headers object or null if no valid token
 */
export const createAuthHeaders = (additionalHeaders: Record<string, string> = {}): Record<string, string> | null => {
  const token = getAuthToken();
  
  if (!token) {
    return null;
  }

  return {
    'Authorization': token,
    'Content-Type': 'application/json',
    ...additionalHeaders
  };
}; 