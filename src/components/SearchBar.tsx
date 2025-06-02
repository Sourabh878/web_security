import { useState, useEffect, useRef } from "react";
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
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { toast } = useToast();
  const wrapperRef = useRef<HTMLDivElement>(null);

  // Hide suggestions on click outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

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

    let cleanDomain = domain.trim().toLowerCase();
    cleanDomain = cleanDomain.replace(/^(https?:\/\/)?(www\.)?/i, "");
    cleanDomain = cleanDomain.split("/")[0];

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

    setShowSuggestions(false);
    onSearch(cleanDomain);
  };

  const fetchSuggestions = async (query: string) => {
    try {
      const res = await fetch(`https://autocomplete.clearbit.com/v1/companies/suggest?query=${query}`);
      const data = await res.json();
      setSuggestions(data.map((item: any) => item.domain));
      setShowSuggestions(true);
    } catch (error) {
      console.error("Suggestion fetch error:", error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setDomain(value);

    if (value.length > 1) {
      fetchSuggestions(value);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="w-full max-w-xl mx-auto">
      <div ref={wrapperRef} className="relative flex flex-col items-stretch">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Enter a domain name (e.g., example.com)"
            value={domain}
            onChange={handleChange}
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

        {showSuggestions && suggestions.length > 0 && (
          <ul className="absolute top-full mt-1 w-full bg-white border rounded shadow z-10 max-h-60 overflow-auto">
            {suggestions.map((sugg, idx) => (
              <li
                key={idx}
                className="px-4 py-2 hover:bg-gray-100 cursor-pointer text-sm"
                onClick={() => {
                  setDomain(sugg);
                  setSuggestions([]);
                  setShowSuggestions(false);
                }}
              >
                {sugg}
              </li>
            ))}
          </ul>
        )}
      </div>
    </form>
  );
};

export default SearchBar;
