
// Helper functions for formatting and displaying data

export const formatHeaderName = (header: string): string => {
  const headerMap: Record<string, string> = {
    "strict-transport-security": "Strict-Transport-Security",
    "content-security-policy": "Content-Security-Policy",
    "x-content-type-options": "X-Content-Type-Options",
    "x-frame-options": "X-Frame-Options",
    "referrer-policy": "Referrer-Policy",
    "permissions-policy": "Permissions-Policy",
    "x-xss-protection": "X-XSS-Protection"
  };
  
  return headerMap[header] || header;
};

export const headerDescription = (header: string): string => {
  const descriptions: Record<string, string> = {
    "strict-transport-security": "Ensures the website is only accessed over HTTPS and prevents downgrade attacks.",
    "content-security-policy": "Restricts the sources of content that can be loaded, helping prevent XSS attacks.",
    "x-content-type-options": "Prevents browsers from MIME-sniffing a response from the declared content-type.",
    "x-frame-options": "Protects against clickjacking attacks by preventing embedding in frames.",
    "referrer-policy": "Controls what information is included in the Referer header when navigating away from the page.",
    "permissions-policy": "Allows a site to control which features and APIs can be used in the browser.",
    "x-xss-protection": "Enables cross-site scripting filtering in supported browsers."
  };
  
  return descriptions[header] || "";
};

export const headerRecommendation = (header: string): string => {
  const recommendations: Record<string, string> = {
    "strict-transport-security": "enforce HTTPS connections",
    "content-security-policy": "restrict sources of executable scripts",
    "x-content-type-options": "prevent MIME type sniffing",
    "x-frame-options": "protect against clickjacking",
    "referrer-policy": "control referrer information",
    "permissions-policy": "restrict browser feature access",
    "x-xss-protection": "enable XSS filtering"
  };
  
  return recommendations[header] || "";
};

export const gradeExplanation = (grade: string): string => {
  const explanations: Record<string, string> = {
    "A+": "Exceptional - The site uses optimal SSL/TLS configuration with perfect forward secrecy.",
    "A": "Excellent - The site has a strong SSL/TLS configuration with good security.",
    "A-": "Very Good - The site has a strong SSL/TLS configuration with minor issues.",
    "B+": "Good - The site has a decent SSL/TLS configuration but could be improved.",
    "B": "Adequate - The site's SSL/TLS configuration has some moderate issues.",
    "B-": "Fair - The site's SSL/TLS configuration needs attention.",
    "C+": "Mediocre - The site's SSL/TLS configuration has significant issues.",
    "C": "Poor - The site's SSL/TLS configuration has serious issues.",
    "C-": "Very Poor - The site's SSL/TLS configuration is highly vulnerable.",
    "D+": "Bad - The site's SSL/TLS configuration is almost completely insecure.",
    "D": "Very Bad - The site's SSL/TLS configuration is dangerous.",
    "D-": "Critical - The site's SSL/TLS configuration exposes users to attacks.",
    "F": "Failing - The site's SSL/TLS configuration is completely insecure."
  };
  
  return explanations[grade] || "Grade information not available";
};

export const recommendationsSSL = (grade: string): string[] => {
  const baseRecommendations = [
    "Enable HTTP Strict Transport Security (HSTS)",
    "Configure secure cipher suites prioritizing forward secrecy",
    "Disable TLS 1.0 and TLS 1.1 protocols"
  ];
  
  if (grade.startsWith("A")) {
    return ["Your SSL/TLS configuration is strong. Continue monitoring for new best practices."];
  } else if (grade.startsWith("B")) {
    return [
      ...baseRecommendations,
      "Update to the latest SSL/TLS certificate authorities"
    ];
  } else if (grade.startsWith("C")) {
    return [
      ...baseRecommendations,
      "Update to the latest SSL/TLS certificate authorities",
      "Fix certificate chain issues",
      "Address any weak ciphers in your configuration"
    ];
  } else {
    return [
      ...baseRecommendations,
      "Update to the latest SSL/TLS certificate authorities",
      "Fix certificate chain issues",
      "Address any weak ciphers in your configuration",
      "Update your SSL/TLS implementation immediately",
      "Consider engaging a security expert to audit your configuration"
    ];
  }
};

export const getServiceNameForPort = (port: number): string => {
  const commonPorts: Record<number, string> = {
    21: "FTP",
    22: "SSH",
    23: "Telnet",
    25: "SMTP",
    53: "DNS",
    80: "HTTP",
    110: "POP3",
    143: "IMAP",
    443: "HTTPS",
    3306: "MySQL",
    8080: "HTTP Alternate"
  };
  
  return commonPorts[port] || "Unknown";
};
