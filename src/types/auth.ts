export interface AuthStrategy {
  apply(url: string, headers?: Record<string, string>): { url: string; protocols?: string[]; headers?: Record<string, string> };
  maskCredentials(): string;
}