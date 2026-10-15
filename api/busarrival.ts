export interface LTABusArrivalResponse {
  'odata.metadata'?: string;
  BusStopCode: string;
  Services: Array<{
    ServiceNo: string;
    Operator: string;
    NextBus?: {
      OriginCode: string;
      DestinationCode: string;
      EstimatedArrival: string;
      Latitude: string;
      Longitude: string;
      VisitNumber: string;
      Load: string; // "SEA" | "SDA" | "LSD"
      Feature: string; // "WAB"
      Type: string; // "SD" | "DD" | "BD"
    };
    NextBus2?: any;
    NextBus3?: any;
  }>;
}

// Universal serverless handler supporting Node.js (req, res) and Web standard Request
export default async function handler(req: any, res?: any) {
  // CORS Headers
  const corsHeaders: Record<string, string> = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, AccountKey, x-account-key, Authorization',
    'Content-Type': 'application/json'
  };

  // Handle OPTIONS preflight
  if (req?.method === 'OPTIONS') {
    if (res?.writeHead) {
      res.writeHead(204, corsHeaders);
      res.end();
      return;
    }
    return new Response(null, { status: 204, headers: corsHeaders });
  }

  try {
    // Parse URL and query parameters
    let urlObj: URL;
    if (typeof req?.url === 'string') {
      urlObj = new URL(req.url, 'http://localhost');
    } else {
      urlObj = new URL('http://localhost');
    }

    const query = req?.query || {};
    const busStopCode =
      query.BusStopCode ||
      query.busStopCode ||
      urlObj.searchParams.get('BusStopCode') ||
      urlObj.searchParams.get('busStopCode') ||
      '83139'; // Default provided in LTA specification

    const serviceNo =
      query.ServiceNo ||
      query.serviceNo ||
      urlObj.searchParams.get('ServiceNo') ||
      urlObj.searchParams.get('serviceNo');

    // Retrieve API key from environment variables or client headers (do not hardcode)
    const incomingHeaderKey =
      req?.headers?.['accountkey'] ||
      req?.headers?.['AccountKey'] ||
      req?.headers?.['x-account-key'] ||
      (req?.headers instanceof Headers ? req.headers.get('AccountKey') || req.headers.get('x-account-key') : null);

    const accountKey =
      process.env.LTA_ACCOUNT_KEY ||
      process.env.LTA_API_KEY ||
      process.env.ACCOUNT_KEY ||
      incomingHeaderKey ||
      query.AccountKey ||
      query.accountKey ||
      urlObj.searchParams.get('AccountKey') ||
      urlObj.searchParams.get('accountKey') ||
      '';

    if (!accountKey) {
      const errorPayload = {
        error: 'Missing LTA DataMall AccountKey',
        message:
          'LTA_ACCOUNT_KEY environment variable is not configured. Please set your LTA DataMall AccountKey in the server environment variables or pass an "AccountKey" header.',
        BusStopCode: busStopCode,
        hint: 'You can request a free API key at https://datamall.lta.gov.sg'
      };

      if (res?.writeHead && typeof res.end === 'function') {
        res.writeHead(401, corsHeaders);
        res.end(JSON.stringify(errorPayload, null, 2));
        return;
      }

      return new Response(JSON.stringify(errorPayload, null, 2), {
        status: 401,
        headers: corsHeaders
      });
    }

    // Build official LTA DataMall v3 URL
    let targetUrl = `https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=${encodeURIComponent(
      busStopCode
    )}`;

    if (serviceNo) {
      targetUrl += `&ServiceNo=${encodeURIComponent(serviceNo)}`;
    }

    // Fetch live data from LTA DataMall
    const ltaResponse = await fetch(targetUrl, {
      method: 'GET',
      headers: {
        AccountKey: accountKey,
        accept: 'application/json'
      }
    });

    const rawText = await ltaResponse.text();
    let data: any;
    try {
      data = JSON.parse(rawText);
    } catch {
      data = {
        status: ltaResponse.status,
        statusText: ltaResponse.statusText,
        message:
          ltaResponse.status === 401 || ltaResponse.status === 403
            ? 'LTA DataMall rejected the AccountKey. Please verify your AccountKey is valid and active.'
            : rawText || 'Non-JSON response received from LTA DataMall'
      };
    }

    if (res?.writeHead && typeof res.end === 'function') {
      res.writeHead(ltaResponse.status, corsHeaders);
      res.end(JSON.stringify(data, null, 2));
      return;
    }

    return new Response(JSON.stringify(data, null, 2), {
      status: ltaResponse.status,
      headers: corsHeaders
    });
  } catch (error: any) {
    const errorPayload = {
      error: 'Failed to fetch from LTA DataMall',
      details: error?.message || String(error)
    };

    if (res?.writeHead && typeof res.end === 'function') {
      res.writeHead(500, corsHeaders);
      res.end(JSON.stringify(errorPayload));
      return;
    }

    return new Response(JSON.stringify(errorPayload), {
      status: 500,
      headers: corsHeaders
    });
  }
}

// Export GET handler for Edge / Web Request runtimes
export async function GET(request: Request) {
  return handler(request);
}
