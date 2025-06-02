
import React from 'react';
import { Globe, Clock, Lock, FileWarning, Radio, Shield } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import { Badge } from "@/components/ui/badge";
import { formatHeaderName } from "@/utils/formatHelpers";
import { 
  useIPInfoQuery, usePingQuery, useSSLInfoQuery, useMalwareQuery, 
  usePortQuery, useHeadersQuery 
} from "@/hooks/useScanQueries";

interface OverviewTabProps {
  domain: string;
}

const OverviewTab = ({ domain }: OverviewTabProps) => {
  const ipInfoQuery = useIPInfoQuery(domain);
  const pingQuery = usePingQuery(domain);
  const sslInfoQuery = useSSLInfoQuery(domain);
  const malwareQuery = useMalwareQuery(domain);
  const portQuery = usePortQuery(domain);
  const headersQuery = useHeadersQuery(domain);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* IP Information */}
      <ResultCard
        title="IP Information"
        icon={<Globe className="h-5 w-5" />}
      >
        {ipInfoQuery.data && (
          <div className="space-y-2">
            <p><strong>IP Address:</strong> {ipInfoQuery.data.ip}</p>
            <p><strong>Country:</strong> {ipInfoQuery.data.location.country}</p>
            <p><strong>Region:</strong> {ipInfoQuery.data.location.regionName}</p>
            <p><strong>City:</strong> {ipInfoQuery.data.location.city}</p>
            <p><strong>ISP:</strong> {ipInfoQuery.data.location.isp}</p>
            <p><strong>Organization:</strong> {ipInfoQuery.data.location.org}</p>
          </div>
        )}
      </ResultCard>
      
      {/* Ping Result */}
      <ResultCard
        title="Ping Results"
        icon={<Clock className="h-5 w-5" />}
      >
        {pingQuery.data && (
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <Badge variant={pingQuery.data.alive ? "default" : "destructive"}>
                {pingQuery.data.alive ? "Online" : "Offline"}
              </Badge>
            </div>
            <p><strong>Response Time:</strong> {pingQuery.data.time} ms</p>
            <p><strong>Min:</strong> {pingQuery.data.min}</p>
            <p><strong>Max:</strong> {pingQuery.data.max}</p>
            <p><strong>Avg:</strong> {pingQuery.data.avg}</p>
            <p><strong>Packet Loss:</strong> {pingQuery.data.packetLoss}</p>
          </div>
        )}
      </ResultCard>
      
      {/* SSL Summary */}
      <ResultCard
        title="SSL/TLS Summary"
        icon={<Lock className="h-5 w-5" />}
      >
        {sslInfoQuery.data && sslInfoQuery.data.endpoints && sslInfoQuery.data.endpoints.length > 0 ? (
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <Badge
                variant={
                  sslInfoQuery.data.endpoints[0].grade?.startsWith("A") 
                    ? "default" 
                    : sslInfoQuery.data.endpoints[0].grade?.startsWith("B") 
                      ? "secondary" 
                      : "destructive"
                }
              >
                Grade: {sslInfoQuery.data.endpoints[0].grade || "Unknown"}
              </Badge>
            </div>
            <p><strong>Host:</strong> {sslInfoQuery.data.host}</p>
            <p><strong>Port:</strong> {sslInfoQuery.data.port}</p>
            <p><strong>Protocol:</strong> {sslInfoQuery.data.protocol}</p>
            <p><strong>Warnings:</strong> {sslInfoQuery.data.endpoints[0].hasWarnings ? "Yes" : "No"}</p>
          </div>
        ) : (
          <p>SSL information not available.</p>
        )}
      </ResultCard>
      
      {/* Malware Scan */}
      <ResultCard
        title="Malware Scan"
        icon={<FileWarning className="h-5 w-5" />}
      >
        {malwareQuery.data && (
          <div className="space-y-2">
            <div className="flex items-center mb-2">
              <Badge
                variant={malwareQuery.data.status === "No Malware Detected" ? "default" : "destructive"}
              >
                {malwareQuery.data.status}
              </Badge>
            </div>
            {malwareQuery.data.malicious && (
              <p>
                <strong>Detection Count:</strong> {malwareQuery.data.malicious} security vendors
              </p>
            )}
            <p className="text-sm text-muted-foreground mt-2">
              Scan powered by VirusTotal API
            </p>
          </div>
        )}
      </ResultCard>
      
      {/* Open Ports */}
      <ResultCard
        title="Open Ports"
        icon={<Radio className="h-5 w-5" />}
      >
        {portQuery.data && (
          <div>
            <p className="mb-2"><strong>IP Address:</strong> {portQuery.data.ip}</p>
            <div className="grid grid-cols-2 gap-2">
              {portQuery.data.ports.filter(p => p.status === "open").length > 0 ? (
                portQuery.data.ports
                  .filter(p => p.status === "open")
                  .map(port => (
                    <Badge key={port.port} className="justify-center py-1">
                      Port {port.port}
                    </Badge>
                  ))
              ) : (
                <p>No common ports found open.</p>
              )}
            </div>
            
            <p className="text-sm text-muted-foreground mt-4">
              Scanned common ports: 21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 8080
            </p>
          </div>
        )}
      </ResultCard>
      
      {/* Security Headers Summary */}
      <ResultCard
        title="Security Headers"
        icon={<Shield className="h-5 w-5" />}
      >
        {headersQuery.data && headersQuery.data.headers && (
          <div>
            {Object.entries(headersQuery.data.headers).map(([header, value]) => (
              <div key={header} className="mb-2 flex items-center">
                <Badge
                  variant={value ? "default" : "outline"}
                  className="mr-2"
                >
                  {value ? "✓" : "✕"}
                </Badge>
                <span>{formatHeaderName(header)}</span>
              </div>
            ))}
          </div>
        )}
      </ResultCard>
    </div>
  );
};

export default OverviewTab;
