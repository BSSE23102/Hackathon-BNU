const API_BASE = process.env.NEXT_PUBLIC_API_URL || '';

class ApiClient {
  private base: string;

  constructor(base: string) {
    this.base = base;
  }

  private async request<T>(path: string, init?: RequestInit): Promise<T> {
    const res = await fetch(`${this.base}${path}`, {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    });
    if (!res.ok) {
      throw new Error(`API ${res.status}: ${res.statusText}`);
    }
    return res.json();
  }

  get<T>(path: string) {
    return this.request<T>(path);
  }

  post<T>(path: string, body: unknown) {
    return this.request<T>(path, {
      method: 'POST',
      body: JSON.stringify(body),
    });
  }
}

export const api = new ApiClient(API_BASE);
