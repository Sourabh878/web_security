import React, { useState } from "react";
import NavBar from "@/components/NavBar";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { unparse } from "papaparse";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import "./web_performence1.css";

interface MetricData {
  name: string;
  value: number;
}

interface Metrics {
  data: MetricData[];
  speedIndex: number;
}

const WebsitePerformanceAnalyzer: React.FC = () => {
  const [url, setUrl] = useState<string>("");
  const [metrics, setMetrics] = useState<Metrics | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const getPerformanceRating = (speedIndex: number): string => {
    if (speedIndex < 2000) return "Excellent";
    if (speedIndex < 4000) return "Good";
    if (speedIndex < 6000) return "Average";
    return "Poor";
  };

  const fetchData = async () => {
    setIsLoading(true);
    try {
      const res = await axios.get(
        `http://localhost:5000/api/pagespeed?url=${encodeURIComponent(url)}`
      );
      const audits = res.data.lighthouseResult.audits;
      const speedIndex = audits["speed-index"].numericValue;

      const data: MetricData[] = [
        { name: "FCP", value: audits["first-contentful-paint"].numericValue },
        { name: "LCP", value: audits["largest-contentful-paint"].numericValue },
        { name: "Speed Index", value: speedIndex },
        { name: "TTI", value: audits["interactive"].numericValue },
      ];

      setMetrics({ data, speedIndex });
    } catch (err) {
      console.error(err);
      alert("Failed to fetch performance data.");
    } finally {
      setIsLoading(false);
    }
  };

  const exportToPDF = async () => {
    const element = document.getElementById("report");
    if (!element) return;

    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      windowWidth: document.documentElement.scrollWidth,
      windowHeight: document.documentElement.scrollHeight,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    const pageWidth = pdf.internal.pageSize.width;
    const pageHeight = pdf.internal.pageSize.height;

    const scaleX = pageWidth / canvas.width;
    const scaleY = pageHeight / canvas.height;
    const scale = Math.min(scaleX, scaleY);

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width * scale, canvas.height * scale);

    let totalHeight = canvas.height * scale;
    let currentHeight = pageHeight;

    while (currentHeight < totalHeight) {
      pdf.addPage();
      pdf.addImage(imgData, "PNG", 0, -currentHeight, canvas.width * scale, canvas.height * scale);
      currentHeight += pageHeight;
    }

    pdf.save("full_website_report.pdf");
  };

  const exportToCSV = () => {
    if (!metrics) return;
    const csvData = [
      ["Metric", "Value (ms)"],
      ...metrics.data.map((m) => [m.name, m.value.toString()]),
    ];
    const csv = unparse(csvData);
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", "website_metrics.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div className="min-h-screen bg-background">
      <NavBar />
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-2 mb-8">
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent animate-gradient">
            Website Performance Analyzer
          </h1>
          <p className="text-muted-foreground text-lg">Analyze your website's performance metrics</p>
        </div>
        
        <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
          <div className="flex flex-col md:flex-row gap-4 items-end">
            <div className="flex-1">
              <label htmlFor="url" className="block text-sm font-medium text-muted-foreground mb-2">
                Enter Website URL
              </label>
              <input
                type="text"
                id="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full rounded-md border border-input bg-background px-4 py-2"
                disabled={isLoading}
              />
            </div>
            <button
              onClick={fetchData}
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-2 rounded-md transition-colors disabled:opacity-50"
            >
              {isLoading ? "Analyzing..." : "Analyze"}
            </button>
          </div>
        </div>

        {isLoading && (
          <div className="bg-card rounded-lg shadow-lg p-6 mb-8">
            <div className="text-center mb-4">
              <h2 className="text-xl font-semibold mb-2">Analyzing Website Performance</h2>
              <p className="text-muted-foreground">Please wait while we gather performance metrics...</p>
            </div>
            <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
              <div className="h-full bg-primary animate-pulse rounded-full" style={{ width: '100%' }}></div>
            </div>
          </div>
        )}


<div className="flex justify-end gap-4 mt-6 border-t pt-6 border-red-700">
              <button
                onClick={exportToCSV}
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export CSV
              </button>
              <button
                onClick={exportToPDF}
                className="bg-blue-600 text-white hover:bg-blue-700 px-6 py-2.5 rounded-lg transition-colors flex items-center gap-2 font-medium shadow-md hover:shadow-lg"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm5 6a1 1 0 10-2 0v3.586l-1.293-1.293a1 1 0 10-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 11.586V8z" clipRule="evenodd" />
                </svg>
                Export PDF
              </button>
            </div>

        {metrics && !isLoading && (
          <div id="report" className="bg-card rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-semibold mb-6 text-center">
              Performance Report
              <span className="block text-sm text-muted-foreground mt-2">
                Speed Index Rating: {getPerformanceRating(metrics.speedIndex)}
              </span>
            </h2>

            <div className="overflow-x-auto">
              <table className="w-full mb-8">
                <thead>
                  <tr>
                    <th className="px-4 py-2 bg-muted">Metric</th>
                    <th className="px-4 py-2 bg-muted">Value (ms)</th>
                  </tr>
                </thead>
                <tbody>
                  {metrics.data.map((metric) => (
                    <tr key={metric.name}>
                      <td className="border px-4 py-2">{metric.name}</td>
                      <td className="border px-4 py-2">{metric.value.toFixed(2)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="graph-container mb-8">
              <ResponsiveContainer width="100%" height={400}>
                <LineChart
                  data={metrics.data}
                  margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                >
                  <CartesianGrid
                    strokeDasharray="3 3"
                    stroke="var(--border)"
                    horizontal={true}
                    vertical={true}
                    opacity={0.5}
                  />
                  <XAxis
                    dataKey="name"
                    stroke="var(--foreground)"
                    tick={{ fill: 'var(--foreground)' }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    padding={{ left: 20, right: 20 }}
                  />
                  <YAxis
                    stroke="var(--foreground)"
                    tick={{ fill: 'var(--foreground)' }}
                    tickLine={{ stroke: 'var(--border)' }}
                    axisLine={{ stroke: 'var(--border)' }}
                    label={{
                      value: 'Time (ms)',
                      angle: -90,
                      position: 'insideLeft',
                      fill: 'var(--foreground)',
                      style: { textAnchor: 'middle' }
                    }}
                    padding={{ top: 20, bottom: 20 }}
                  />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'var(--card)',
                      border: '1px solid var(--border)',
                      borderRadius: 'var(--radius)',
                      color: 'var(--foreground)'
                    }}
                  />
                  <Legend
                    wrapperStyle={{
                      color: 'var(--foreground)'
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="value"
                    name="Load Time"
                    stroke="#3b82f6"
                    strokeWidth={3}
                    connectNulls
                    dot={{
                      fill: 'var(--background)',
                      stroke: "#3b82f6",
                      strokeWidth: 2,
                      r: 6
                    }}
                    activeDot={{
                      r: 8,
                      fill: 'var(--primary)',
                      stroke: "#3b82f6",
                      strokeWidth: 2
                    }}
                    isAnimationActive={true}
                    animationBegin={0}
                    animationDuration={1500}
                    animationEasing="ease-in-out"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          
          </div>
        )}
      </div>
    </div>
  );
};

export default WebsitePerformanceAnalyzer;
