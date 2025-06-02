
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

interface ErrorQuery {
  name: string;
  query: {
    isError: boolean;
  }
}

export const useScanError = (errorQueries: ErrorQuery[], domain: string | null) => {
  const [hasErrorToast, setHasErrorToast] = useState(false);
  const { toast } = useToast();
  
  const failedQueries = errorQueries
    .filter(q => q.query.isError)
    .map(q => q.name);

  const hasError = failedQueries.length > 0;

  // Use an effect to show the error toast only once when errors occur
  useEffect(() => {
    if (hasError && domain && !hasErrorToast) {
      let errorMessage = "Failed to scan domain. Please try again.";
      
      // If we have specific failed queries, mention them
      if (failedQueries.length > 0) {
        if (failedQueries.length === errorQueries.length) {
          errorMessage = "Could not connect to scanning services. Please check your backend server.";
        } else {
          errorMessage = `Failed to fetch: ${failedQueries.join(", ")}`;
        }
      }
      
      toast({
        title: "Scan Error",
        description: errorMessage,
        variant: "destructive",
      });
      
      console.error("Scan errors:", failedQueries);
      setHasErrorToast(true);
    }
  }, [hasError, domain, toast, hasErrorToast, failedQueries, errorQueries.length]);

  return { 
    hasError, 
    failedQueries, 
    setHasErrorToast 
  };
};
