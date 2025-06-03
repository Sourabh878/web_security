import React from 'react';
import { Globe, Cookie } from "lucide-react";
import ResultCard from "@/components/ResultCard";
import { Badge } from "@/components/ui/badge";
import { useCookieQuery } from "@/hooks/useScanQueries";

interface CookiesTabProps {
  domain: string;
}

const CookiesTab = ({ domain }: CookiesTabProps) => {
  const cookieQuery = useCookieQuery(domain);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {/* Website Screenshot */}
      <ResultCard
        title="Website Screenshot"
        icon={<Globe className="h-5 w-5" />}
        className="md:col-span-2"
      >
        {cookieQuery.data && cookieQuery.data.screenshot ? (
          <div className="flex justify-center">
            <img 
              src={`http://localhost:5000${cookieQuery.data.screenshot}`} 
              alt={`Screenshot of ${domain}`}
              className="rounded-md shadow-md max-w-full"
            />
          </div>
        ) : (
          <p>Screenshot not available.</p>
        )}
      </ResultCard>
      
      {/* Cookies Analysis */}
      <ResultCard
        title="Cookies Analysis"
        icon={<Cookie className="h-5 w-5" />}
        className="md:col-span-2"
      >
        {cookieQuery.data && cookieQuery.data.cookies ? (
          <div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="bg-card shadow rounded-lg p-4 text-center">
                <p className="text-2xl font-bold">{cookieQuery.data.cookies.length}</p>
                <p className="text-muted-foreground">Total Cookies</p>
              </div>
              
              {["Session Cookie", "Authentication Cookie", "Tracking Cookie", "Other"].map((type) => {
                const count = cookieQuery.data.cookies.filter(c => c.type === type).length;
                return (
                  <div key={type} className="bg-card shadow rounded-lg p-4 text-center">
                    <p className="text-2xl font-bold">{count}</p>
                    <p className="text-muted-foreground">{type === "Other" ? "Other Cookies" : type + "s"}</p>
                  </div>
                );
              })}
            </div>
            
            {cookieQuery.data.cookies.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-center py-2 px-2">Name</th>
                      <th className="text-center py-2 px-2">Domain</th>
                      <th className="text-center py-2 px-2">Type</th>
                      <th className="text-center py-2 px-2">Attributes</th>
                      <th className="text-center py-2 px-2">Expires</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cookieQuery.data.cookies.map((cookie, i) => (
                      <tr key={i} className="border-b">
                        <td className="py-2 px-2 font-mono text-sm text-center">{cookie.name}</td>
                        <td className="py-2 px-2 text-sm text-center">{cookie.domain}</td>
                        <td className="py-2 px-2 text-center">
                          <Badge variant="outline">{cookie.type}</Badge>
                        </td>
                        <td className="py-2 px-2 text-center">
                          <div className="flex flex-wrap gap-1 justify-center">
                            {cookie.secure && <Badge variant="secondary">Secure</Badge>}
                            {cookie.httpOnly && <Badge variant="secondary">HttpOnly</Badge>}
                            {cookie.sameSite && <Badge variant="secondary">SameSite={cookie.sameSite}</Badge>}
                          </div>
                        </td>
                        <td className="py-2 px-2 text-sm text-center">
                          {cookie.expires ? new Date(cookie.expires * 1000).toLocaleDateString() : "Session"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <p>No cookies found on this website.</p>
            )}
          </div>
        ) : (
          <p>Cookie information not available.</p>
        )}
      </ResultCard>
    </div>
  );
};

export default CookiesTab;
