
import { useState, useEffect } from 'react';
import { Progress } from "@/components/ui/progress";
import { Card, CardContent } from "@/components/ui/card";
import { SecurityHeader, SSLInfo } from '@/services/securityApi';
import { Shield, ShieldAlert, ShieldCheck, AlertTriangle } from "lucide-react";

interface SecurityScoreProps {
  headers?: SecurityHeader;
  ssl?: SSLInfo;
}

const SecurityScore = ({ headers, ssl }: SecurityScoreProps) => {
  const [score, setScore] = useState(0);
  const [grade, setGrade] = useState('');
  const [color, setColor] = useState('bg-gray-200');
  
  useEffect(() => {
    if (!headers || !ssl) return;
    
    let calculatedScore = 0;
    
    // Calculate score based on headers
    const headerScores = {
      'strict-transport-security': 15,
      'content-security-policy': 20,
      'x-content-type-options': 10,
      'x-frame-options': 10,
      'referrer-policy': 5,
      'permissions-policy': 5,
      'x-xss-protection': 5,
    };
    
    if (headers.headers) {
      Object.entries(headers.headers).forEach(([header, value]) => {
        if (value && header in headerScores) {
          calculatedScore += headerScores[header as keyof typeof headerScores];
        }
      });
    }
    
    // Add score for SSL
    if (ssl.endpoints && ssl.endpoints.length > 0) {
      const sslGrade = ssl.endpoints[0].grade;
      
      if (sslGrade) {
        const sslScores: Record<string, number> = {
          'A+': 30, 'A': 25, 'A-': 20,
          'B+': 15, 'B': 10, 'B-': 5,
          'C+': 3, 'C': 2, 'C-': 1,
        };
        
        const sslScore = sslGrades[sslGrade] || 0;
        calculatedScore += sslScore;
      }
    }
    
    setScore(calculatedScore);
    
    // Determine grade and color based on score
    if (calculatedScore >= 90) {
      setGrade('A+');
      setColor('bg-green-500');
    } else if (calculatedScore >= 80) {
      setGrade('A');
      setColor('bg-green-400');
    } else if (calculatedScore >= 70) {
      setGrade('B+');
      setColor('bg-lime-500');
    } else if (calculatedScore >= 60) {
      setGrade('B');
      setColor('bg-yellow-400');
    } else if (calculatedScore >= 50) {
      setGrade('C+');
      setColor('bg-yellow-500');
    } else if (calculatedScore >= 40) {
      setGrade('C');
      setColor('bg-orange-500');
    } else if (calculatedScore >= 30) {
      setGrade('D');
      setColor('bg-orange-600');
    } else {
      setGrade('F');
      setColor('bg-red-500');
    }
  }, [headers, ssl]);
  
  if (!headers || !ssl) {
    return null;
  }
  
  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Security Score</h3>
          <div className="flex items-center">
            {score >= 70 ? (
              <ShieldCheck className="h-5 w-5 mr-2 text-green-500" />
            ) : score >= 40 ? (
              <AlertTriangle className="h-5 w-5 mr-2 text-yellow-500" />
            ) : (
              <ShieldAlert className="h-5 w-5 mr-2 text-red-500" />
            )}
            <span className="font-bold text-2xl">{grade}</span>
          </div>
        </div>
        
        <Progress className="h-2 mb-2" value={score} />
        
        <div className="flex justify-between text-sm text-muted-foreground mt-1">
          <span>Poor</span>
          <span>Average</span>
          <span>Excellent</span>
        </div>
      </CardContent>
    </Card>
  );
};

// Map SSL grades to numeric scores
const sslGrades: Record<string, number> = {
  'A+': 30, 'A': 25, 'A-': 20,
  'B+': 15, 'B': 10, 'B-': 5,
  'C+': 3, 'C': 2, 'C-': 1,
  'D+': 0, 'D': 0, 'D-': 0,
  'F': 0, 'T': 0, 'M': 0
};

export default SecurityScore;
