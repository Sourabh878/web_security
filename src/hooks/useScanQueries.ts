import { useQuery } from "@tanstack/react-query";
import securityApi from "@/services/securityApi";

export const useIPInfoQuery = (domain: string | null) => {
  return useQuery({
    queryKey: ["ipInfo", domain],
    queryFn: () => domain ? securityApi.getIPInfo(domain) : Promise.reject("No domain"),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const usePingQuery = (domain: string | null) => {
  return useQuery({
    queryKey: ["ping", domain],
    queryFn: () => domain ? securityApi.getPingResult(domain) : Promise.reject("No domain"),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useSSLInfoQuery = (domain: string | null) => {
  return useQuery({
    queryKey: ["ssl", domain],
    queryFn: () => domain ? securityApi.getSSLInfo(domain) : Promise.reject("No domain"),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useDNSQuery = (domain: string | null) => {
  return useQuery({
    queryKey: ["dns", domain],
    queryFn: () => domain ? securityApi.getDNSRecords(domain) : Promise.reject("No domain"),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const usePortQuery = (domain: string | null) => {
  return useQuery({
    queryKey: ["ports", domain],
    queryFn: () => domain ? securityApi.getPortInfo(domain) : Promise.reject("No domain"),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useHeadersQuery = (domain: string | null) => {
  return useQuery({
    queryKey: ["headers", domain],
    queryFn: () => domain ? securityApi.getSecurityHeaders(domain) : Promise.reject("No domain"),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useMalwareQuery = (domain: string | null) => {
  return useQuery({
    queryKey: ["malware", domain],
    queryFn: () => domain ? securityApi.getMalwareInfo(domain) : Promise.reject("No domain"),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};

export const useCookieQuery = (domain: string | null) => {
  return useQuery({
    queryKey: ["cookies", domain],
    queryFn: () => domain ? securityApi.getCookieInfo(domain) : Promise.reject("No domain"),
    enabled: !!domain,
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
};
