import { useState } from "react";
import NavBar from "@/components/NavBar";
import SearchBar from "@/components/SearchBar";
import SecurityScore from "@/components/SecurityScore";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import OverviewTab from "@/components/scan/OverviewTab";
import SSLTab from "@/components/scan/SSLTab";
import HeadersTab from "@/components/scan/HeadersTab";
import DNSTab from "@/components/scan/DNSTab";
import CookiesTab from "@/components/scan/CookiesTab";
import ScanningProgress from "@/components/scan/ScanningProgress";
import { useScanError } from "@/hooks/useScanError";
import Gemini from "@/components/Gemini";
import { Button } from "@/components/ui/button";
import { MessageSquare } from "lucide-react";
import {
  useIPInfoQuery,
  usePingQuery,
  useSSLInfoQuery,
  useDNSQuery,
  usePortQuery,
  useHeadersQuery,
  useMalwareQuery,
  useCookieQuery
} from "@/hooks/useScanQueries";

const ScanPage = () => {
  const [domain, setDomain] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const { toast } = useToast();

  // Initialize all queries
  const ipInfoQuery = useIPInfoQuery(domain);
  const pingQuery = usePingQuery(domain);
  const sslInfoQuery = useSSLInfoQuery(domain);
  const dnsQuery = useDNSQuery(domain);
  const portQuery = usePortQuery(domain);
  const headersQuery = useHeadersQuery(domain);
  const malwareQuery = useMalwareQuery(domain);
  const cookieQuery = useCookieQuery(domain);

  // Check for specific errors
  const errorQueries = [
    { name: "IP Info", query: ipInfoQuery },
    { name: "Ping", query: pingQuery },
    { name: "SSL", query: sslInfoQuery },
    { name: "DNS", query: dnsQuery },
    { name: "Ports", query: portQuery },
    { name: "Security Headers", query: headersQuery },
    { name: "Malware", query: malwareQuery },
    { name: "Cookies", query: cookieQuery }
  ];
  
  // Handle error display with custom hook
  const { hasError, setHasErrorToast } = useScanError(errorQueries, domain);

  const isLoading = 
    ipInfoQuery.isLoading || 
    pingQuery.isLoading || 
    sslInfoQuery.isLoading ||
    dnsQuery.isLoading ||
    portQuery.isLoading ||
    headersQuery.isLoading ||
    malwareQuery.isLoading ||
    cookieQuery.isLoading;

  const handleSearch = (searchDomain: string) => {
    console.log("Searching domain:", searchDomain);
    setDomain(searchDomain);
    setHasErrorToast(false); // Reset error toast flag when new search is initiated
    
    // Inform user that scan has started
    toast({
      title: "Scan Started",
      description: `Scanning ${searchDomain}...`,
    });
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-grow">
        <section className="py-8 md:py-12 px-4 bg-muted/50">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Website Security Scanner
            </h1>
            
            <p className="text-lg md:text-xl text-center mb-6 md:mb-8 max-w-3xl mx-auto text-muted-foreground">
              Enter a domain name to scan for security vulnerabilities and get a detailed analysis.
            </p>
            
            <SearchBar onSearch={handleSearch} isLoading={isLoading} />
          </div>
        </section>

        {isLoading && <ScanningProgress domain={domain} />}
        
        {domain && !isLoading && !hasError && (
          <section className="py-8 md:py-12 px-4">
            <div className="container mx-auto max-w-[1200px]">
              <div className="flex flex-col md:flex-row justify-between items-start gap-6 md:gap-8 relative">
                {/* Main Content */}
                <div className={`flex-1 min-w-0 transition-all duration-300 ${showAI ? 'md:mr-[400px]' : ''}`}>
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4 mb-6 md:mb-8">
                    <div>
                      <h2 className="text-xl md:text-2xl font-bold mb-2">
                        Results for <span className="text-primary">{domain}</span>
                      </h2>
                      <p className="text-sm text-muted-foreground">
                        Scan completed at {new Date().toLocaleTimeString()}
                      </p>
                    </div>
                    
                    <div className="w-full md:w-auto">
                      <SecurityScore headers={headersQuery.data} ssl={sslInfoQuery.data} />
                    </div>
                  </div>
                  
                  <Tabs defaultValue="overview" className="w-full">
                    <TabsList className="w-full flex mb-6 md:mb-8 overflow-x-auto">
                      <TabsTrigger value="overview" className="flex-1 min-w-[100px]">Overview</TabsTrigger>
                      <TabsTrigger value="ssl" className="flex-1 min-w-[100px]">SSL/TLS</TabsTrigger>
                      <TabsTrigger value="headers" className="flex-1 min-w-[100px]">Headers</TabsTrigger>
                      <TabsTrigger value="dns" className="flex-1 min-w-[100px]">DNS & Infrastructure</TabsTrigger>
                      <TabsTrigger value="cookies" className="flex-1 min-w-[100px]">Cookies & Screenshot</TabsTrigger>
                    </TabsList>
                    
                    <div className="space-y-6">
                      <TabsContent value="overview">
                        <OverviewTab domain={domain} />
                      </TabsContent>
                      
                      <TabsContent value="ssl">
                        <SSLTab domain={domain} />
                      </TabsContent>
                      
                      <TabsContent value="headers">
                        <HeadersTab domain={domain} />
                      </TabsContent>
                      
                      <TabsContent value="dns">
                        <DNSTab domain={domain} />
                      </TabsContent>
                      
                      <TabsContent value="cookies">
                        <CookiesTab domain={domain} />
                      </TabsContent>
                    </div>
                  </Tabs>
                </div>

                {/* AI Chat Sidebar */}
                <div className={`fixed right-0 top-0 h-screen w-[400px] bg-background border-l shadow-lg transform transition-transform duration-300 z-50 ${showAI ? 'translate-x-0' : 'translate-x-full'}`}>
                  <div className="h-full flex flex-col">
                    <div className="p-4 border-b flex justify-between items-center bg-muted/50">
                      <h3 className="text-lg font-semibold">AI Assistant</h3>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowAI(false)}
                        className="flex items-center gap-2"
                      >
                        <MessageSquare className="h-4 w-4" />
                        Close
                      </Button>
                    </div>
                    <Gemini
                      finalQuery=""
                      setResponse={setAiResponse}
                      onClose={() => setShowAI(false)}
                      domain={domain}
                    />
                  </div>
                </div>

                {/* AI Chat Toggle Button */}
                {!showAI && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setShowAI(true)}
                    className="fixed right-4 top-20 flex items-center gap-2 shadow-md z-40"
                  >
                    <MessageSquare className="h-4 w-4" />
                    Open AI Assistant
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6 md:py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SecuriScan. All rights reserved.</p>
          <p className="mt-2 text-sm">A powerful website security scanning tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default ScanPage;
