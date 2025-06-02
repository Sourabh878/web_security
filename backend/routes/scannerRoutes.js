import express from 'express';
import { 
  getIPInfo, 
  getPingResult,
  getSSLInfo,
  getDNSRecords,
  getPortInfo,
  getSecurityHeaders,
  getMalwareInfo,
  getCookieInfo
} from '../controllers/scannerController.js';

const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', message: 'Scanner API is running' });
});

// Scanner endpoints
router.get('/ipinfo', getIPInfo);
router.get('/ping', getPingResult);
router.get('/ssl', getSSLInfo);
router.get('/dns', getDNSRecords);
router.get('/ports', getPortInfo);
router.get('/security-headers', getSecurityHeaders);
router.get('/malware', getMalwareInfo);
router.get('/cookies', getCookieInfo);

export default router;
