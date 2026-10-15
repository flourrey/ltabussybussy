export interface HealthResponse {
  status: 'ok' | 'degraded';
  service: string;
  timestamp: string;
  ltaKeyConfigured: boolean;
  version: string;
}

// Universal handler supporting both Node.js (req, res) and Web standard Request
export default async function handler(req: any, res?: any) {
  // CORS Headers
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, AccountKey, x-account-key',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (req?.method === 'OPTIONS') {
    if (res?.writeHead) {
      res.writeHead(204, headers);
      res.end();
      return;
    }
    return new Response(null, { status: 204, headers });
  }

  const ltaKeyConfigured = Boolean(
    process.env.LTA_ACCOUNT_KEY ||
    process.env.LTA_API_KEY ||
    process.env.ACCOUNT_KEY
  );

  const payload: HealthResponse = {
    status: 'ok',
    service: 'lta-datamall-serverless-api',
    timestamp: new Date().toISOString(),
    ltaKeyConfigured,
    version: '1.0.0'
  };

  // Node.js (Express / Vercel Node runtime) response
  if (res?.writeHead && typeof res.end === 'function') {
    res.writeHead(200, headers);
    res.end(JSON.stringify(payload));
    return;
  }

  // Web API / Edge runtime response
  return new Response(JSON.stringify(payload), {
    status: 200,
    headers
  });
}

// Also export GET for standard Web Fetch API / Edge routes
export async function GET(request: Request) {
  return handler(request);
}
