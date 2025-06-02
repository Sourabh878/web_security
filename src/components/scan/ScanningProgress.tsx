
import React from 'react';
import { Progress } from "@/components/ui/progress";

interface ScanningProgressProps {
  domain: string | null;
}

const ScanningProgress = ({ domain }: ScanningProgressProps) => {
  return (
    <div className="container mx-auto max-w-5xl py-16 px-4 text-center">
      <h2 className="text-2xl font-semibold mb-6">Scanning {domain}...</h2>
      <Progress value={45} className="w-full max-w-md mx-auto h-2 mb-8" />
      <p className="text-muted-foreground">
        Please wait while we analyze the security of the domain. This may take a few moments.
      </p>
    </div>
  );
};

export default ScanningProgress;
