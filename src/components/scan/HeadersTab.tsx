
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useHeadersQuery } from "@/hooks/useScanQueries";
import { formatHeaderName, headerDescription, headerRecommendation } from "@/utils/formatHelpers";

interface HeadersTabProps {
  domain: string;
}

const HeadersTab = ({ domain }: HeadersTabProps) => {
  const headersQuery = useHeadersQuery(domain);

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-xl font-medium mb-4">Security Headers Analysis</h3>
        
        {headersQuery.data && headersQuery.data.headers && (
          <div className="space-y-6">
            {Object.entries(headersQuery.data.headers).map(([header, value]) => (
              <div key={header} className="space-y-2">
                <div className="flex items-center">
                  <Badge
                    variant={value ? "default" : "destructive"}
                    className="mr-2"
                  >
                    {value ? "✓ Present" : "✕ Missing"}
                  </Badge>
                  <h4 className="font-medium">{formatHeaderName(header)}</h4>
                </div>
                
                {value && (
                  <div className="bg-muted p-3 rounded text-sm overflow-x-auto">
                    <code>{value}</code>
                  </div>
                )}
                
                <p className="text-muted-foreground text-sm">
                  {headerDescription(header)}
                </p>
              </div>
            ))}
            
            <Separator />
            
            <div>
              <h4 className="font-medium mb-2">Recommendations</h4>
              <ul className="list-disc pl-5 space-y-1">
                {Object.entries(headersQuery.data.headers)
                  .filter(([_, value]) => !value)
                  .map(([header, _]) => (
                    <li key={header} className="text-muted-foreground">
                      Add the <strong>{formatHeaderName(header)}</strong> header to {headerRecommendation(header)}
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HeadersTab;
