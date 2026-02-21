/**
 * Gateway API Client
 * 
 * HTTP client for communicating with the Nyx Gateway API.
 * Provides typed request/response handling and error management.
 */

const DEFAULT_BASE_URL = 'http://localhost:8080';
const DEFAULT_TIMEOUT = 30000;

export interface ApiConfig {
  baseUrl: string;
  timeout: number;
  headers?: Record<string, string>;
}

export interface ApiResponse<T> {
  data: T;
  status: number;
  headers: Headers;
}

export interface ApiError {
  message: string;
  status: number;
  code?: string;
  details?: unknown;
}

export class GatewayApiClient {
  private config: ApiConfig;

  constructor(config: Partial<ApiConfig> = {}) {
    this.config = {
      baseUrl: config.baseUrl ?? DEFAULT_BASE_URL,
      timeout: config.timeout ?? DEFAULT_TIMEOUT,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    };
  }

  /**
   * Update the base URL for API requests
   */
  setBaseUrl(url: string): void {
    this.config.baseUrl = url;
  }

  /**
   * Set authentication token
   */
  setAuthToken(token: string): void {
    this.config.headers = {
      ...this.config.headers,
      'Authorization': `Bearer ${token}`,
    };
  }

  /**
   * Make a GET request
   */
  async get<T>(path: string, params?: Record<string, string>): Promise<ApiResponse<T>> {
    const queryString = params ? `?${new URLSearchParams(params)}` : '';
    return this.request<T>('GET', `${path}${queryString}`);
  }

  /**
   * Make a POST request
   */
  async post<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('POST', path, body);
  }

  /**
   * Make a PUT request
   */
  async put<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PUT', path, body);
  }

  /**
   * Make a PATCH request
   */
  async patch<T>(path: string, body?: unknown): Promise<ApiResponse<T>> {
    return this.request<T>('PATCH', path, body);
  }

  /**
   * Make a DELETE request
   */
  async delete<T>(path: string): Promise<ApiResponse<T>> {
    return this.request<T>('DELETE', path);
  }

  private async request<T>(
    method: string,
    path: string,
    body?: unknown
  ): Promise<ApiResponse<T>> {
    const url = `${this.config.baseUrl}${path}`;
    
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(url, {
        method,
        headers: this.config.headers,
        body: body ? JSON.stringify(body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw await this.createError(response);
      }

      const data = await this.parseResponse<T>(response);
      
      return {
        data,
        status: response.status,
        headers: response.headers,
      };
    } catch (error) {
      clearTimeout(timeoutId);
      
      if (error instanceof GatewayApiError) {
        throw error;
      }
      
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new GatewayApiError({
            message: 'Request timeout',
            status: 408,
            code: 'TIMEOUT',
          });
        }
        throw new GatewayApiError({
          message: error.message,
          status: 0,
          code: 'NETWORK_ERROR',
        });
      }
      
      throw error;
    }
  }

  private async parseResponse<T>(response: Response): Promise<T> {
    const contentType = response.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      return response.json() as Promise<T>;
    }
    
    return response.text() as unknown as T;
  }

  private async createError(response: Response): Promise<GatewayApiError> {
    let errorData: Partial<ApiError> = {};
    
    try {
      errorData = await response.json();
    } catch {
      // Response body is not JSON
    }

    return new GatewayApiError({
      message: errorData.message ?? `HTTP Error ${response.status}`,
      status: response.status,
      code: errorData.code ?? `HTTP_${response.status}`,
      details: errorData.details,
    });
  }
}

export class GatewayApiError extends Error {
  status: number;
  code?: string;
  details?: unknown;

  constructor(error: ApiError) {
    super(error.message);
    this.name = 'GatewayApiError';
    this.status = error.status;
    this.code = error.code;
    this.details = error.details;
  }
}

// Export singleton instance
export const gatewayApi = new GatewayApiClient();
