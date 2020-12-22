export interface RequestInfo extends RequestInit {
  url?: string;
}

export class Hassio {
  constructor(private baseUrl: string, private token: string) {}

  async request(options: RequestInfo): Promise<any> {
    const { method = 'GET', url = '', body } = options;
    const headers = new Headers((options.headers || {}) as HeaderMap);
    headers.set('Authentication', `Bearer ${this.token}`);

    console.info(`send hassio request ${this.baseUrl}${url}`);
    const response = await fetch(`${this.baseUrl}${url}`, {
      method,
      headers,
      body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
    });
    console.info(`hassio response: ${JSON.stringify(response)}`);
    return await response.json();
  }

  async get(url: string): Promise<any> {
    return this.request({
      method: 'GET',
      url,
    });
  }

  async post(url: string, body?: any): Promise<any> {
    return this.request({
      method: 'POST',
      url,
      body,
    });
  }

  async callService(domain: string, service: string, data: any): Promise<any> {
    return this.post(`/api/services/${domain}/${service}`, data);
  }
}
