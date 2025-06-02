
import { Shield } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ModeToggle } from "./mode-toggle";

const NavBar = () => {
  return (
    <nav className="bg-card shadow-md">
      <div className="container mx-auto px-4 md:px-6 py-4 flex justify-between items-center">
        <Link to="/" className="flex items-center space-x-2">
          <Shield className="h-8 w-8 text-primary" />
          <span className="font-bold text-xl">SecuriScan</span>
        </Link>
        
        <div className="flex items-center space-x-4">
          <Link to="/">
            <Button variant="ghost">Home</Button>
          </Link>
          <Link to="/about">
            <Button variant="ghost">About</Button>
          </Link>
          <Link to="/scan">
            <Button variant="default">Scan Now</Button>
          </Link>
          <ModeToggle />
        </div>
      </div>
    </nav>
  );
};

export default NavBar;
