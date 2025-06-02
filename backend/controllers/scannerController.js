import express from "express";
import cors from "cors";
import dns from "dns";
import ping from "ping";
import axios from "axios";
import net from "net";
import http from "http";
import https from "https";
import { URL } from "url";
import puppeteer from "puppeteer";
import path from "path";
import fs from 'fs';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// IP and Host Info
export const getIPInfo = async (req, res) => {
  const domain = req.query.domain;
  dns.lookup(domain, async (err, address) => {
    if (err) return res.status(500).json({ error: "DNS lookup failed" });
    try {
      const ipRes = await axios.get(`http://ip-api.com/json/${address}`);
      console.log("ip: ", ipRes, address);
      
      res.json({ ip: address, location: ipRes.data });
    } catch {
      res.status(500).json({ error: "IP lookup failed" });
    }
  });
};

// Ping
export const getPingResult = async (req, res) => {
  const domain = req.query.domain;
  const result = await ping.promise.probe(domain);
  res.json(result);
};

// SSL Info
export const getSSLInfo = async (req, res) => {
  const domain = req.query.domain;
  try {
    const { data } = await axios.get(`https://api.ssllabs.com/api/v3/analyze?host=${domain}`);
    res.json(data);
  } catch {
    res.status(500).json({ error: "SSL Info fetch failed" });
  }
};

// DNS Records
export const getDNSRecords = (req, res) => {
  const domain = req.query.domain;
  dns.resolveAny(domain, (err, records) => {
    if (err) return res.status(500).json({ error: "DNS resolve failed" });
    console.log("records: ", records);
    
    res.json({ records });
  });
};

// Port Scanner
function checkPort(host, port, timeout = 2000) {
  return new Promise((resolve) => {
    const socket = new net.Socket();
    let status = "closed";

    socket.setTimeout(timeout);
    socket.on("connect", () => {
      status = "open";
      socket.destroy();
    });
    socket.on("timeout", () => socket.destroy());
    socket.on("error", () => {});
    socket.on("close", () => resolve({ port, status }));

    socket.connect(port, host);
  });
}

export const getPortInfo = async (req, res) => {
  const domain = req.query.domain;
  dns.lookup(domain, async (err, ip) => {
    if (err) return res.status(500).json({ error: "DNS lookup failed" });

    const portsToCheck = [21, 22, 23, 25, 53, 80, 110, 143, 443, 3306, 8080];
    const checks = await Promise.all(portsToCheck.map((port) => checkPort(ip, port)));
    res.json({ ip, ports: checks });
  });
};

// Security Headers Check

export const getSecurityHeaders = async (req, res) => {
  const domain = req.query.domain;
  if (!domain) return res.status(400).json({ error: "Domain is required" });

  try {
    const response = await axios.get(`https://${domain}`, { maxRedirects: 5 });
    const headers = response.headers;

    const requiredHeaders = [
      "strict-transport-security",
      "content-security-policy",
      "x-content-type-options",
      "x-frame-options",
      "referrer-policy",
      "permissions-policy",
      "x-xss-protection"
    ];

    const result = {};
    requiredHeaders.forEach(header => {
      result[header] = headers[header] || null;
    });

    res.json({ headers: result });
  } catch (error) {
    res.status(500).json({ error: "Fetch error or invalid domain" });
  }
};


// Malware Detection (VirusTotal API)
export const getMalwareInfo = async (req, res) => {
  const domain = req.query.domain;
  const apiKey = "138836cd061e814c1e43847e5551dfc742dc1833faec7d5ecbad0746538f4639";  // Replace with your actual VirusTotal API key

  try {
    const url = `https://www.virustotal.com/api/v3/domains/${domain}`;

    const response = await axios.get(url, {
      headers: {
        "x-apikey": apiKey,
      },
    });

    const data = response.data;

    if (data.data.attributes.last_analysis_stats.malicious > 0) {
      res.json({
        status: "Malware Detected",
        malicious: data.data.attributes.last_analysis_stats.malicious,
        details: data.data.attributes.last_analysis_results,
      });
    } else {
      res.json({
        status: "No Malware Detected",
        details: data.data.attributes.last_analysis_results,
      });
    }
  } catch (error) {
    console.error("Malware detection error:", error);
    res.status(500).json({ error: "Malware detection failed" });
  }
};

// Cookie Info
export const getCookieInfo = async (req, res) => {
  const urlParam = req.query.url;
  if (!urlParam) return res.status(400).json({ error: "URL is required" });

  const url = `https://${urlParam}`;
  console.log("url: ", url);

  try {
    const browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1366, height: 768 }); // Laptop-like view

    await page.setUserAgent(
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114 Safari/537.36"
    );

    await page.goto(url, {
      waitUntil: "networkidle2",
      timeout: 60000,
    });

    // Save screenshot as webImg.png
    const screenshotDir = path.join(__dirname, "screenshots");
    await fs.promises.mkdir(screenshotDir, { recursive: true });

    const filename = "webImg.png"; // Fixed filename
    const screenshotPath = path.join(screenshotDir, filename);
    await page.screenshot({ path: screenshotPath, fullPage: false });

    const cookies = await page.cookies();

    const classifyCookie = (cookie) => {
      const name = cookie.name.toLowerCase();
      if (name.includes("session")) return "Session Cookie";
      if (name.includes("auth")) return "Authentication Cookie";
      if (name.includes("track") || cookie.domain.includes("google") || name.startsWith("_ga")) return "Tracking Cookie";
      return "Other";
    };

    const detailedCookies = cookies.map(c => ({
      name: c.name,
      domain: c.domain,
      secure: c.secure,
      httpOnly: c.httpOnly,
      sameSite: c.sameSite,
      expires: c.expires,
      type: classifyCookie(c),
    }));

    await browser.close();

    res.json({
      cookies: detailedCookies,
      screenshot: `/screenshots/${filename}`
    });
  } catch (err) {
    console.error("Cookie fetch error:", err.message);
    res.status(500).json({ error: "Failed to fetch cookies or screenshot", message: err.message });
  }
};