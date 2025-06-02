
import NavBar from "@/components/NavBar";
import { Shield, Lock, FileText, Globe, Check, AlertTriangle, Server, Database } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const AboutPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-12 md:py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-6 text-center">
              About <span className="gradient-text">SecuriScan</span>
            </h1>
            
            <p className="text-xl text-center mb-8 max-w-3xl mx-auto">
              A comprehensive tool for analyzing website security, identifying vulnerabilities, and enhancing your online protection.
            </p>
          </div>
        </section>
        
        {/* What We Do */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center">How It Works</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Globe className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Domain Analysis</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We analyze domain information including IP location, WHOIS data, and DNS configuration to provide insights about the website's infrastructure.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <Lock className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Security Testing</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We perform comprehensive security tests including SSL/TLS analysis, security headers check, and port scanning to identify potential vulnerabilities.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <AlertTriangle className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Threat Detection</h3>
                  </div>
                  <p className="text-muted-foreground">
                    Our system scans for malware, suspicious activities, and known vulnerabilities by checking against multiple threat intelligence databases.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="card-hover">
                <CardContent className="p-6">
                  <div className="flex mb-4">
                    <div className="bg-primary/10 rounded-full p-3 mr-4">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="text-xl font-medium">Detailed Reports</h3>
                  </div>
                  <p className="text-muted-foreground">
                    We provide comprehensive reports with actionable insights and recommendations to improve your website's security posture.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-muted/50 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <FeatureItem icon={<Shield />} title="Security Headers Analysis" />
              <FeatureItem icon={<Lock />} title="SSL/TLS Security Assessment" />
              <FeatureItem icon={<Server />} title="Port Scanning" />
              <FeatureItem icon={<Database />} title="WHOIS Data Analysis" />
              <FeatureItem icon={<AlertTriangle />} title="Malware Detection" />
              <FeatureItem icon={<Globe />} title="DNS Record Analysis" />
            </div>
          </div>
        </section>
        
        {/* Why Choose Us */}
        <section className="py-16 px-4">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold mb-12 text-center">Why Choose SecuriScan</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <div className="flex items-start mb-6">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Comprehensive Analysis</h3>
                    <p className="text-muted-foreground">
                      We provide all-in-one security scanning with multiple tools integrated into a seamless experience.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">User-Friendly Interface</h3>
                    <p className="text-muted-foreground">
                      Our intuitive design makes complex security information accessible and actionable for all users.
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <div className="flex items-start mb-6">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Actionable Recommendations</h3>
                    <p className="text-muted-foreground">
                      We don't just identify issues - we provide clear, practical steps to fix vulnerabilities.
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start mb-6">
                  <div className="bg-green-100 rounded-full p-1 mr-3 mt-1">
                    <Check className="h-4 w-4 text-green-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-medium mb-2">Regular Updates</h3>
                    <p className="text-muted-foreground">
                      Our security databases and scanning tools are continuously updated to detect emerging threats.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SecuriScan. All rights reserved.</p>
          <p className="mt-2">A powerful website security scanning tool.</p>
        </div>
      </footer>
    </div>
  );
};

const FeatureItem = ({ icon, title }: { icon: React.ReactNode, title: string }) => {
  return (
    <div className="flex items-center bg-card p-4 rounded-lg shadow-sm">
      <div className="bg-primary/10 rounded-full p-2 mr-3">
        <div className="text-primary">
          {icon}
        </div>
      </div>
      <h3 className="font-medium">{title}</h3>
    </div>
  );
};

export default AboutPage;
