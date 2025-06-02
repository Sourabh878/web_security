import { useEffect, useRef, useState } from "react";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { useIPInfoQuery, usePingQuery, useSSLInfoQuery, useDNSQuery, usePortQuery, useHeadersQuery, useMalwareQuery, useCookieQuery } from "@/hooks/useScanQueries";

interface GeminiProps {
  finalQuery: string;
  setResponse: (response: string) => void;
  onClose: () => void;
  domain: string;
}

const Gemini = ({ finalQuery, setResponse, onClose, domain }: GeminiProps) => {
  const [chatHistory, setChatHistory] = useState([]);
  const [userInput, setUserInput] = useState("");
  const chatRef = useRef(null);
  const websiteContextRef = useRef(null);
  const bottomRef = useRef(null);

  // Get all scan data
  const ipInfoQuery = useIPInfoQuery(domain);
  const pingQuery = usePingQuery(domain);
  const sslInfoQuery = useSSLInfoQuery(domain);
  const dnsQuery = useDNSQuery(domain);
  const portQuery = usePortQuery(domain);
  const headersQuery = useHeadersQuery(domain);
  const malwareQuery = useMalwareQuery(domain);
  const cookieQuery = useCookieQuery(domain);

  const apiKey = "AIzaSyAPXEZ7XQpt9Ity3U2vC9utUE0-lIOSCbE";
  const genAI = new GoogleGenerativeAI(apiKey);
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [chatHistory]);

  const getInitialContext = () => {
    const context = {
      domain,
      ipInfo: ipInfoQuery.data,
      ping: pingQuery.data,
      ssl: sslInfoQuery.data,
      dns: dnsQuery.data,
      ports: portQuery.data,
      headers: headersQuery.data,
      malware: malwareQuery.data,
      cookies: cookieQuery.data
    };
    return JSON.stringify(context, null, 2);
  };

  const initChat = async () => {
    if (!chatRef.current) {
      const initialContext = getInitialContext();
      chatRef.current = await model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: `You are a website security expert. Here is the scan data for ${domain}:\n${initialContext}\n\nKeep answers in 5-8 lines and remember previous questions. When asked about the current website, use this scan data to provide accurate information.` }],
          },
          {
            role: "model",
            parts: [{ text: "I understand. I'll use the provided scan data to give accurate information about the website's security status, infrastructure, and other technical details. I'll keep my responses concise and relevant." }],
          },
        ],
      });
    }
  };

  const handleSend = async (text) => {
    if (!text.trim()) return;
    await initChat();

    // Step 1: Check if the message is IP/location JSON
    try {
      const maybeJson = JSON.parse(text);
      if (maybeJson?.ip && maybeJson?.location) {
        websiteContextRef.current = `This IP/location data is for the current website:\n${text}`;
        console.log("📌 Saved website context:", websiteContextRef.current);
      }
    } catch (err) {
      // not valid JSON, ignore
    }

    // Step 2: If user says "current website", inject context
    let finalText = text;
    if (
      text.toLowerCase().includes("current website") &&
      websiteContextRef.current
    ) {
      finalText = `${websiteContextRef.current}\n\nUser Query: ${text}`;
    }
    
    finalText = `Regarding the website ${domain}, here's my question: ${finalText}`;
    console.log("🚀 Final prompt sent to Gemini:", finalText);

    // Step 3: Send message
    const newHistory = [...chatHistory, { role: "user", parts: [{ text }] }];
    setChatHistory(newHistory);
    setUserInput("");

    const result = await chatRef.current.sendMessage(finalText);
    const responseText = result.response.text().replace(/[*]+/g, "").trim();

    const updatedHistory = [
      ...newHistory,
      { role: "model", parts: [{ text: responseText }] },
    ];

    setChatHistory(updatedHistory);
    setResponse(responseText);
  };

  useEffect(() => {
    if (finalQuery) {
      handleSend(finalQuery);
    }
  }, [finalQuery]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 overflow-hidden">
        <div className="space-y-2 overflow-y-auto h-full p-4">
          {chatHistory.map((msg, idx) => (
            <div
              key={idx}
              className={`p-2 rounded ${msg.role === "user" ? "bg-blue-100 text-right" : "bg-gray-200 text-left"}`}
              style={{ wordWrap: "break-word", overflowWrap: "break-word" }}
            >
              <p className="text-sm">{msg.parts[0].text}</p>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>
      </div>
  
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <input
            type="text"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            className="flex-1 border rounded p-2 text-sm"
            placeholder="Ask about website security..."
            onKeyPress={(e) => {
              if (e.key === 'Enter') {
                handleSend(userInput);
              }
            }}
          />
          <button
            onClick={() => handleSend(userInput)}
            className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 transition-colors text-sm"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Gemini; 