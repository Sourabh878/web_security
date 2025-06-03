import { Shield, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import NavBar from "@/components/NavBar";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <NavBar />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="py-16 md:py-24 px-4">
          <div className="container mx-auto max-w-6xl text-center">
            <div className="flex justify-center mb-6">
              <Shield className="h-20 w-20 text-primary" />
            </div>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="gradient-text">Website Security Scanner</span>
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Analyze domain security, scan for vulnerabilities, and get detailed reports to protect your online presence.
            </p>
            
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/scan">
                <Button size="lg" className="text-lg px-8">
                  Scan Now
                </Button>
              </Link>
              
              <Link to="/about">
                <Button size="lg" variant="outline" className="text-lg px-8">
                  Learn More
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 px-4 bg-muted/50">
          <div className="container mx-auto max-w-6xl">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Security Analysis</h3>
                <p className="text-muted-foreground">
                  Comprehensive security scanning including SSL/TLS, headers, DNS, and malware detection.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">Performance Metrics</h3>
                <p className="text-muted-foreground">
                  Detailed performance analysis with metrics like FCP, LCP, Speed Index, and TTI.
                </p>
              </div>
              
              <div className="bg-card p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-semibold mb-4">AI-Powered Insights</h3>
                <p className="text-muted-foreground">
                  Get intelligent recommendations and explanations powered by advanced AI.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-muted py-6 md:py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-muted-foreground">
          <p>© {new Date().getFullYear()} SecuriScan. All rights reserved.</p>
          <p className="mt-2 text-sm">A powerful website security and performance scanning tool.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
