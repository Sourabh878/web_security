
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReactNode } from "react";

interface ResultCardProps {
  title: string;
  icon: ReactNode;
  children: ReactNode;
  className?: string;
}

const ResultCard = ({ title, icon, children, className = "" }: ResultCardProps) => {
  return (
    <Card className={`card-hover ${className}`}>
      <CardHeader className="pb-2">
        <CardTitle className="flex items-center text-lg font-medium space-x-2">
          <span className="text-primary">{icon}</span>
          <span>{title}</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
};

export default ResultCard;
