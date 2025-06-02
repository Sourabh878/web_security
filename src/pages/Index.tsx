
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

              <Link to="/Web_performence">
                <Button size="lg"  className="text-lg px-8">
                  Website Performance
                </Button>
              </Link>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section className="py-16 bg-secondary/50">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold text-center mb-12">
              Comprehensive Security Analysis
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <FeatureCard 
                title="Domain Information" 
                description="Get detailed information about domain ownership, registration, and hosting details."
              />
              <FeatureCard 
                title="SSL/TLS Security" 
                description="Check SSL certificate validity, encryption strength, and protocol support."
              />
              <FeatureCard 
                title="Security Headers" 
                description="Analyze HTTP security headers to protect against XSS, clickjacking, and other attacks."
              />
              <FeatureCard 
                title="DNS Records" 
                description="Review DNS configuration and check for common misconfigurations and vulnerabilities."
              />
              <FeatureCard 
                title="Port Scanning" 
                description="Discover open ports and detect potentially vulnerable services."
              />
              <FeatureCard 
                title="Malware Detection" 
                description="Scan for known malware signatures and identify potential threats."
              />
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 md:py-24 text-center">
          <div className="container mx-auto max-w-6xl px-4">
            <h2 className="text-3xl font-bold mb-6">Start Securing Your Website Today</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Don't wait until it's too late. Scan your website now to identify vulnerabilities and protect your digital assets.
            </p>
            <Link to="/scan">
              <Button size="lg" className="text-lg px-8">
                Scan Your Website
              </Button>
            </Link>
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

// Feature Card Component
const FeatureCard = ({ title, description }: { title: string; description: string }) => {
  return (
    <div className="bg-card rounded-lg p-6 shadow-sm transition-all hover:shadow-md">
      <h3 className="text-xl font-medium mb-3">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
};

export default Index;
