
# Security Scanner Backend

This is a simple backend implementation for the Security Scanner application.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Start the server:
   ```
   npm start
   ```

   For development with auto-reload:
   ```
   npm run dev
   ```

3. The API will be accessible at `http://localhost:5000/api`

## API Endpoints

- `/api/health` - Health check
- `/api/ipinfo?domain=example.com` - Get IP information
- `/api/whois?domain=example.com` - Get WHOIS information
- `/api/ping?domain=example.com` - Get ping results
- `/api/ssl?domain=example.com` - Get SSL/TLS information
- `/api/dns?domain=example.com` - Get DNS records
- `/api/ports?domain=example.com` - Get open ports information
- `/api/security-headers?domain=example.com` - Get security headers
- `/api/malware?domain=example.com` - Get malware scan results
- `/api/cookies?url=example.com` - Get cookies and screenshot

## Notes

This is a simplified implementation that provides mock data for most endpoints,
with the exception of the cookies endpoint which actually visits the website using Puppeteer.

For production use, you would need to implement real scanning functionality for each endpoint.
