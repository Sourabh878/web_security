
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { FileQuestion } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/50 px-4">
      <div className="text-center max-w-md">
        <div className="flex justify-center mb-6">
          <div className="bg-primary/10 p-6 rounded-full">
            <FileQuestion className="h-16 w-16 text-primary" />
          </div>
        </div>
        
        <h1 className="text-6xl font-bold text-primary mb-2">404</h1>
        <p className="text-2xl font-medium mb-4">Page Not Found</p>
        
        <p className="text-muted-foreground mb-8">
          The page you are looking for doesn't exist or has been moved. Please check the URL or navigate back to the home page.
        </p>
        
        <Link to="/">
          <Button variant="default" size="lg">
            Return to Home
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
