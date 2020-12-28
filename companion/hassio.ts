export interface RequestInfo extends RequestInit {
  url?: string;
}

export class Hassio {
  constructor(private baseUrl: string, private token: string) {}

  async request(options: RequestInfo): Promise<any> {
    const { method = 'GET', url = '', body } = options;
    const headers = new Headers((options.headers || {}) as HeaderMap);
    headers.set('Authorization', `Bearer ${this.token}`);

    console.info(`send hassio request ${this.baseUrl}${url}`);
    const fetchOptions: RequestInit = {
      method,
      headers,
      body: body && typeof body !== 'string' ? JSON.stringify(body) : body,
    };
    const response = await fetch(`${this.baseUrl}${url}`, fetchOptions);
    console.info(`hassio response: ${JSON.stringify(response)}`);
    console.info(`status: ${response.status}`);
    const responseText = await response.text();
    console.info(`text: ${responseText}`);
    if (!response.ok) {
      throw new Error(
        `HTTP fetch failed ${response.status} ${response.statusText}: \n${responseText}`
      );
    }
    const json = JSON.parse(responseText);
    // console.info(`json response: ${JSON.stringify(json)}`);
    return json;
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
    return await this.post(`/api/services/${domain}/${service}`, data);
  }
}
