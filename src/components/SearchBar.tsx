
import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

interface SearchBarProps {
  onSearch: (domain: string) => void;
  isLoading?: boolean;
}

const SearchBar = ({ onSearch, isLoading = false }: SearchBarProps) => {
  const [domain, setDomain] = useState("kletech.ac.in");
  const { toast } = useToast();
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!domain) {
      toast({
        title: "Error",
        description: "Please enter a domain name",
        variant: "destructive",
      });
      return;
    }
    
    // Clean domain by removing protocol and path
    let cleanDomain = domain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/i, "");
    cleanDomain = cleanDomain.split('/')[0]; // Remove any paths
    
    // Basic domain validation - allow IP addresses as well
    const domainRegex = /^([a-z0-9]([a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,}$/i;
    const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$/;
    
    if (!domainRegex.test(cleanDomain) && !ipRegex.test(cleanDomain)) {
      toast({
        title: "Invalid Domain",
        description: "Please enter a valid domain name (e.g., example.com) or IP address",
        variant: "destructive",
      });
      return;
    }
    
    onSearch(cleanDomain);
  };
  
  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
      <div className="relative flex items-center">
        <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
        <Input
          type="text"
          placeholder="Enter a domain name (e.g., example.com)"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          className="pl-10 pr-20 py-6 text-lg w-full rounded-lg"
        />
        <Button 
          type="submit"
          disabled={isLoading}
          className="absolute right-1 px-4 py-2"
        >
          {isLoading ? "Scanning..." : "Scan"}
        </Button>
      </div>
    </form>
  );
};

export default SearchBar;
