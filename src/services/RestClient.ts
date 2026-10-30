import type { RestEndpoint } from '@/types';

export class RestClient {
  async execute(endpoint: RestEndpoint, variables: Record<string, string> = {}): Promise<{ status: number; data: unknown }> {
    let url = endpoint.url;
    for (const [key, value] of Object.entries(variables)) {
      url = url.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), encodeURIComponent(value));
    }

    let body: string | undefined;
    if (endpoint.bodyTemplate) {
      body = endpoint.bodyTemplate;
      for (const [key, value] of Object.entries(variables)) {
        body = body.replace(new RegExp(`\\{\\{${key}\\}\\}`, 'g'), value);
      }
    }

    const headers: Record<string, string> = { ...endpoint.headers };
    if (body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    const res = await fetch(url, {
      method: endpoint.method,
      headers,
      body: body || undefined,
    });

    const text = await res.text();
    let data: unknown;
    try {
      data = JSON.parse(text);
    } catch {
      data = text;
    }

    return { status: res.status, data };
  }
}