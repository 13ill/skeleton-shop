/**
 * API utility functions with retry mechanism
 */

interface FetchOptions extends RequestInit {
  retries?: number;
  retryDelay?: number;
}

export async function fetchWithRetry(url: string, options: FetchOptions = {}): Promise<Response> {
  const {
    retries = 3,
    retryDelay = 1000,
    ...fetchOptions
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const response = await fetch(url, fetchOptions);

      // If response is OK, return it
      if (response.ok) {
        return response;
      }

      // If response is not OK and we have retries left, try again
      if (attempt < retries) {
        lastError = new Error(`HTTP ${response.status}: ${response.statusText}`);
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }

      // If no retries left, return the error response
      return response;
    } catch (error) {
      lastError = error as Error;

      // If we have retries left, try again
      if (attempt < retries) {
        await new Promise(resolve => setTimeout(resolve, retryDelay * (attempt + 1)));
        continue;
      }

      // If no retries left, throw the error
      throw lastError;
    }
  }

  // This should never be reached, but TypeScript needs it
  throw lastError || new Error('Unknown error in fetchWithRetry');
}

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  return String(error);
}
