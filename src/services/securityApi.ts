import axios from 'axios';

// Define the base URL for our API
const API_URL = 'http://localhost:5000/api';

// Add timeout to axios requests
const axiosInstance = axios.create({
  timeout: 15000, // 15 seconds timeout
});

// Types for our API responses
export interface IPInfo {
  ip: string;
  location: {
    country: string;
    regionName: string;
    city: string;
    isp: string;
    org: string;
    as: string;
    lat: number;
    lon: number;
  };
}

export interface PingResult {
  host: string;
  alive: boolean;
  time: number;
  min: string;
  max: string;
  avg: string;
  stddev: string;
  numeric_host: string;
  packetLoss: string;
}

export interface SSLInfo {
  host: string;
  port: number;
  protocol: string;
  endpoints: Array<{
    grade: string;
    gradeTrustIgnored: string;
    hasWarnings: boolean;
    isExceptional: boolean;
    details: {
      cert: {
        notBefore: number;
        notAfter: number;
        commonNames: string[];
        altNames: string[];
      };
    };
  }>;
  status: string;
}

export interface DNSRecord {
  records: Array<{
    type: string;
    value: string;
    ttl?: number;
  }>;
}

export interface PortInfo {
  ip: string;
  ports: Array<{
    port: number;
    status: 'open' | 'closed';
  }>;
}

export interface SecurityHeader {
  headers: {
    'strict-transport-security': string | null;
    'content-security-policy': string | null;
    'x-content-type-options': string | null;
    'x-frame-options': string | null;
    'referrer-policy': string | null;
    'permissions-policy': string | null;
    'x-xss-protection': string | null;
  };
}

export interface MalwareInfo {
  status: string;
  malicious?: number;
  details: Record<string, any>;
}

export interface Cookie {
  name: string;
  domain: string;
  secure: boolean;
  httpOnly: boolean;
  sameSite: string;
  expires: number;
  type: string;
}

export interface CookieInfo {
  cookies: Cookie[];
  screenshot: string;
}

// Security API service
const securityApi = {
  getIPInfo: async (domain: string): Promise<IPInfo> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/ipinfo?domain=${domain}`);
      return response.data;
    } catch (error) {
      console.error("IP Info API error:", error);
      throw new Error(`Failed to fetch IP information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  getPingResult: async (domain: string): Promise<PingResult> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/ping?domain=${domain}`);
      return response.data;
    } catch (error) {
      console.error("Ping API error:", error);
      throw new Error(`Failed to ping domain: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  getSSLInfo: async (domain: string): Promise<SSLInfo> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/ssl?domain=${domain}`);
      return response.data;
    } catch (error) {
      console.error("SSL API error:", error);
      throw new Error(`Failed to fetch SSL information: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  getDNSRecords: async (domain: string): Promise<DNSRecord> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/dns?domain=${domain}`);
      return response.data;
    } catch (error) {
      console.error("DNS API error:", error);
      throw new Error(`Failed to fetch DNS records: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  getPortInfo: async (domain: string): Promise<PortInfo> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/ports?domain=${domain}`);
      return response.data;
    } catch (error) {
      console.error("Ports API error:", error);
      throw new Error(`Failed to scan ports: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  getSecurityHeaders: async (domain: string): Promise<SecurityHeader> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/security-headers?domain=${domain}`);
      return response.data;
    } catch (error) {
      console.error("Security Headers API error:", error);
      throw new Error(`Failed to fetch security headers: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  getMalwareInfo: async (domain: string): Promise<MalwareInfo> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/malware?domain=${domain}`);
      return response.data;
    } catch (error) {
      console.error("Malware API error:", error);
      throw new Error(`Failed to check for malware: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
  
  getCookieInfo: async (domain: string): Promise<CookieInfo> => {
    try {
      const response = await axiosInstance.get(`${API_URL}/cookies?url=${domain}`);
      return response.data;
    } catch (error) {
      console.error("Cookies API error:", error);
      throw new Error(`Failed to fetch cookies: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
};

export default securityApi;
