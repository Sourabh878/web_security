
import React from 'react';
import { Lock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useSSLInfoQuery } from "@/hooks/useScanQueries";
import { gradeExplanation, recommendationsSSL } from "@/utils/formatHelpers";

interface SSLTabProps {
  domain: string;
}

const SSLTab = ({ domain }: SSLTabProps) => {
  const sslInfoQuery = useSSLInfoQuery(domain);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-medium mb-4">SSL/TLS Security Analysis</h3>
        {sslInfoQuery.data && sslInfoQuery.data.endpoints && sslInfoQuery.data.endpoints.length > 0 ? (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div className="bg-muted p-4 rounded-full">
                <Lock className="h-8 w-8 text-primary" />
              </div>
              <div>
                <div className="flex items-center">
                  <h4 className="text-lg font-medium mr-2">SSL Grade:</h4>
                  <Badge
                    variant={
                      sslInfoQuery.data.endpoints[0].grade?.startsWith("A") 
                        ? "default" 
                        : sslInfoQuery.data.endpoints[0].grade?.startsWith("B") 
                          ? "secondary" 
                          : "destructive"
                    }
                    className="text-lg px-3 py-1"
                  >
                    {sslInfoQuery.data.endpoints[0].grade || "Unknown"}
                  </Badge>
                </div>
                <p className="text-muted-foreground mt-1">
                  {gradeExplanation(sslInfoQuery.data.endpoints[0].grade || "")}
                </p>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Certificate Details</h4>
              {sslInfoQuery.data.endpoints[0].details?.cert ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="text-muted-foreground">Valid From</p>
                    <p>
                      {new Date(sslInfoQuery.data.endpoints[0].details.cert.notBefore * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Valid Until</p>
                    <p>
                      {new Date(sslInfoQuery.data.endpoints[0].details.cert.notAfter * 1000).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Common Names</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sslInfoQuery.data.endpoints[0].details.cert.commonNames.map((name: string) => (
                        <Badge key={name} variant="outline">{name}</Badge>
                      ))}
                    </div>
                  </div>
                  
                  <div className="md:col-span-2">
                    <p className="text-muted-foreground">Alternative Names</p>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {sslInfoQuery.data.endpoints[0].details.cert.altNames.slice(0, 5).map((name: string) => (
                        <Badge key={name} variant="outline">{name}</Badge>
                      ))}
                      {sslInfoQuery.data.endpoints[0].details.cert.altNames.length > 5 && (
                        <Badge variant="outline">+{sslInfoQuery.data.endpoints[0].details.cert.altNames.length - 5} more</Badge>
                      )}
                    </div>
                  </div>
                </div>
              ) : (
                <p>Certificate details not available.</p>
              )}
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Connection Details</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Host</p>
                  <p>{sslInfoQuery.data.host}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Port</p>
                  <p>{sslInfoQuery.data.port}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Protocol</p>
                  <p>{sslInfoQuery.data.protocol}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Status</p>
                  <p>{sslInfoQuery.data.status}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Additional Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-muted-foreground">Grade With Trust Ignored</p>
                  <p>{sslInfoQuery.data.endpoints[0].gradeTrustIgnored || "N/A"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Has Warnings</p>
                  <p>{sslInfoQuery.data.endpoints[0].hasWarnings ? "Yes" : "No"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Is Exceptional</p>
                  <p>{sslInfoQuery.data.endpoints[0].isExceptional ? "Yes" : "No"}</p>
                </div>
              </div>
            </div>
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc pl-5 space-y-1">
                {recommendationsSSL(sslInfoQuery.data.endpoints[0].grade || "").map((rec, i) => (
                  <li key={i} className="text-muted-foreground">{rec}</li>
                ))}
              </ul>
            </div>
          </div>
        ) : (
          <p>SSL information not available for this domain.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default SSLTab;
