import React from 'react';
import { Globe, Key, Server } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useDNSQuery, useIPInfoQuery, usePortQuery } from "@/hooks/useScanQueries";
import { getServiceNameForPort } from "@/utils/formatHelpers";

interface DNSTabProps {
  domain: string;
}

const DNSTab = ({ domain }: DNSTabProps) => {
  const dnsQuery = useDNSQuery(domain);
  const ipQuery = useIPInfoQuery(domain);
  const portQuery = usePortQuery(domain);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* DNS Records */}
      <ResultCard
        title="DNS Records"
        icon={<Server className="h-5 w-5" />}
        className="md:col-span-2"
      >
        {dnsQuery.data && dnsQuery.data.records && (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-2 px-4">Type</th>
                  <th className="text-left py-2 px-4">Value</th>
                  <th className="text-left py-2 px-4">TTL</th>
                </tr>
              </thead>
              <tbody>
                {dnsQuery.data.records.map((record, index) => (
                  <tr key={index} className="border-b">
                    <td className="py-2 px-4">
                      <Badge variant="outline">{record.type}</Badge>
                    </td>
                    <td className="py-2 px-4 font-mono text-sm break-all">
                      {record.value}
                    </td>
                    <td className="py-2 px-4 text-left">
                      {record.ttl || "N/A"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </ResultCard>

      {/* Open Ports Detail */}
      <ResultCard
        title="Open Ports Detail"
        icon={<Server className="h-5 w-5" />}
      >
        {portQuery.data && (
          <div>
            <p className="mb-4">IP Address: <strong>{portQuery.data.ip}</strong></p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-center py-2">Port</th>
                    <th className="text-center py-2">Status</th>
                    <th className="text-center py-2">Service</th>
                  </tr>
                </thead>
                <tbody>
                  {portQuery.data.ports.map((port) => (
                    <tr key={port.port} className="border-b">
                      <td className="py-2">{port.port}</td>
                      <td className="py-2">
                        <Badge
                          variant={port.status === "open" ? "default" : "secondary"}
                        >
                          {port.status}
                        </Badge>
                      </td>
                      <td className="py-2">{getServiceNameForPort(port.port)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </ResultCard>

      {/* IP Location */}
      <ResultCard
        title="IP Location"
        icon={<Globe className="h-5 w-5" />}
      >
        {ipQuery.data && ipQuery.data.location && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <p className="text-sm text-muted-foreground">Country</p>
                <p>{ipQuery.data.location.country}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Region</p>
                <p>{ipQuery.data.location.regionName}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">City</p>
                <p>{ipQuery.data.location.city}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Coordinates</p>
                <p>{ipQuery.data.location.lat}, {ipQuery.data.location.lon}</p>
              </div>
            </div>

            <Separator />
            
            <div>
              <p className="text-sm text-muted-foreground">Internet Service Provider</p>
              <p>{ipQuery.data.location.isp}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">Organization</p>
              <p>{ipQuery.data.location.org}</p>
            </div>
            
            <div>
              <p className="text-sm text-muted-foreground">AS Number</p>
              <p>{ipQuery.data.location.as}</p>
            </div>
          </div>
        )}
      </ResultCard>
    </div>
  );
};

export default DNSTab;
