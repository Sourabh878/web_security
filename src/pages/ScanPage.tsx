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
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { unparse } from "papaparse";

interface MetricData {
  name: string;
  value: number;
}

interface Metrics {
  data: MetricData[];
  speedIndex: number;
}

const ScanPage = () => {
  const [domain, setDomain] = useState<string | null>(null);
  const [showAI, setShowAI] = useState(false);
  const [aiResponse, setAiResponse] = useState("");
  const [performanceMetrics, setPerformanceMetrics] = useState<Metrics | null>(null);
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

  const getPerformanceRating = (speedIndex: number): string => {
    if (speedIndex < 2000) return "Excellent";
    if (speedIndex < 4000) return "Good";
    if (speedIndex < 6000) return "Average";
    return "Poor";
  };

  const fetchPerformanceData = async (url: string) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pagespeed?url=${encodeURIComponent(url)}`
      );
      const audits = res.data.lighthouseResult.audits;
      const speedIndex = audits["speed-index"].numericValue;

      const data: MetricData[] = [
        { name: "FCP", value: audits["first-contentful-paint"].numericValue },
        { name: "LCP", value: audits["largest-contentful-paint"].numericValue },
        { name: "Speed Index", value: speedIndex },
        { name: "TTI", value: audits["interactive"].numericValue },
      ];

      setPerformanceMetrics({ data, speedIndex });
    } catch (err) {
      console.error(err);
      toast({
        title: "Performance Analysis Error",
        description: "Failed to fetch performance data.",
        variant: "destructive",
      });
    }
  };

  const handleSearch = async (searchDomain: string) => {
    console.log("Searching domain:", searchDomain);
    setDomain(searchDomain);
    setHasErrorToast(false);
    setPerformanceMetrics(null);
    
    // Inform user that scan has started
    toast({
      title: "Scan Started",
      description: `Scanning ${searchDomain}...`,
    });

    // Fetch performance data
    await fetchPerformanceData(`https://${searchDomain}`);
  };

  const exportToPDF = async () => {
    const element = document.getElementById("performance-report");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    const scaleX = pageWidth / canvas.width;
    const scaleY = pageHeight / canvas.height;
    const scale = Math.min(scaleX, scaleY);

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width * scale, canvas.height * scale);

    let totalHeight = canvas.height * scale;
    let currentHeight = pageHeight;

    while (currentHeight < totalHeight) {
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -currentHeight, canvas.width * scale, canvas.height * scale);
      currentHeight += pageHeight;
    }

    pdf.save(`${domain}_performance_report.pdf`);
  };

  const exportToCSV = () => {
    if (!performanceMetrics) return;
    const csvData = [
      ["Metric", "Value (ms)"],
      ...performanceMetrics.data.map((m) => [m.name, m.value.toString()]),
    ];
    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${domain}_performance_metrics.csv`);
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <NavBar />
      
      <main className="flex-grow">
        <section className="py-8 md:py-12 px-4 bg-muted/50">
          <div className="container mx-auto max-w-5xl">
            <h1 className="text-3xl md:text-4xl font-bold mb-4 md:mb-6 text-center bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/60">
              Website Security & Performance Scanner
            </h1>
            
            <p className="text-lg md:text-xl text-center mb-6 md:mb-8 max-w-3xl mx-auto text-muted-foreground">
              Enter a domain name to scan for security vulnerabilities and performance metrics.
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
                    <TabsList className="grid w-full grid-cols-6">
                      <TabsTrigger value="overview">Overview</TabsTrigger>
                      <TabsTrigger value="ssl">SSL/TLS</TabsTrigger>
                      <TabsTrigger value="headers">Headers</TabsTrigger>
                      <TabsTrigger value="dns">DNS</TabsTrigger>
                      <TabsTrigger value="cookies">Cookies</TabsTrigger>
                      <TabsTrigger value="performance">Performance</TabsTrigger>
                    </TabsList>

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

                    <TabsContent value="performance">
                      {performanceMetrics && (
                        <div id="performance-report" className="bg-card rounded-lg shadow-lg p-6">
                          <h2 className="text-2xl font-semibold mb-6 text-center">
                            Performance Report
                            <span className="block text-sm text-muted-foreground mt-2">
                              Speed Index Rating: {getPerformanceRating(performanceMetrics.speedIndex)}
                            </span>
                          </h2>

                          <div className="overflow-x-auto">
                            <table className="w-full mb-8">
                              <thead>
                                <tr>
                                  <th className="px-4 py-2 bg-muted text-center">Metric</th>
                                  <th className="px-4 py-2 bg-muted text-center">Value (ms)</th>
                                </tr>
                              </thead>
                              <tbody>
                                {performanceMetrics.data.map((metric) => (
                                  <tr key={metric.name}>
                                    <td className="border px-4 py-2 text-center">{metric.name}</td>
                                    <td className="border px-4 py-2 text-center">{metric.value.toFixed(2)}</td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>

                          <div className="graph-container mb-8">
                            <ResponsiveContainer width="100%" height={400}>
                              <LineChart
                                data={performanceMetrics.data}
                                margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                              >
                                <CartesianGrid
                                  strokeDasharray="3 3"
                                  stroke="var(--border)"
                                  horizontal={true}
                                  vertical={true}
                                  opacity={0.5}
                                />
                                <XAxis
                                  dataKey="name"
                                  stroke="var(--foreground)"
                                  tick={{ fill: 'var(--foreground)' }}
                                  tickLine={{ stroke: 'var(--border)' }}
                                  axisLine={{ stroke: 'var(--border)' }}
                                  padding={{ left: 20, right: 20 }}
                                />
                                <YAxis
                                  stroke="var(--foreground)"
                                  tick={{ fill: 'var(--foreground)' }}
                                  tickLine={{ stroke: 'var(--border)' }}
                                  axisLine={{ stroke: 'var(--border)' }}
                                  label={{
                                    value: 'Time (ms)',
                                    angle: -90,
                                    position: 'insideLeft',
                                    fill: 'var(--foreground)',
                                    style: { textAnchor: 'middle' }
                                  }}
                                  padding={{ top: 20, bottom: 20 }}
                                />
                                <Tooltip
                                  contentStyle={{
                                    backgroundColor: 'var(--card)',
                                    border: '1px solid var(--border)',
                                    borderRadius: 'var(--radius)',
                                    color: 'var(--foreground)'
                                  }}
                                />
                                <Legend
                                  wrapperStyle={{
                                    color: 'var(--foreground)'
                                  }}
                                />
                                <Line
                                  type="monotone"
                                  dataKey="value"
                                  name="Load Time"
                                  stroke="#3b82f6"
                                  strokeWidth={3}
                                  connectNulls
                                  dot={{
                                    fill: 'var(--background)',
                                    stroke: "#3b82f6",
                                    strokeWidth: 2,
                                    r: 6
                                  }}
                                  activeDot={{
                                    r: 8,
                                    fill: 'var(--primary)',
                                    stroke: "#3b82f6",
                                    strokeWidth: 2
                                  }}
                                  isAnimationActive={true}
                                  animationBegin={0}
                                  animationDuration={1500}
                                  animationEasing="ease-in-out"
                                />
                              </LineChart>
                            </ResponsiveContainer>
                          </div>

                          <div className="flex justify-end gap-4 mt-6 border-t pt-6">
                            <button
                              onClick={exportToCSV}
                              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                              </svg>
                              Export CSV
                            </button>
                            <button
                              onClick={exportToPDF}
                              className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                              </svg>
                              Export PDF
                            </button>
                          </div>
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </div>

                {/* AI Assistant */}
                <div
                  className={`fixed top-0 right-0 h-full w-[400px] bg-card shadow-lg transform transition-transform duration-300 ease-in-out ${
                    showAI ? "translate-x-0" : "translate-x-full"
                  }`}
                >
                  <div className="p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold">AI Assistant</h3>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setShowAI(false)}
                      >
                        ×
                      </Button>
                    </div>
                    <Gemini
                      domain={domain}
                      onResponse={setAiResponse}
                      response={aiResponse}
                    />
                  </div>
                </div>

                {/* AI Assistant Toggle */}
                <Button
                  variant="outline"
                  size="icon"
                  className="fixed bottom-4 right-4 rounded-full shadow-lg"
                  onClick={() => setShowAI(!showAI)}
                >
                  <MessageSquare className="h-5 w-5" />
                </Button>
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
