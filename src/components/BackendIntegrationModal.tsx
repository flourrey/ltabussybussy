import React, { useState } from 'react';
import {
  Server,
  X,
  Code,
  Check,
  Copy,
  ExternalLink,
  Zap,
  Globe
} from 'lucide-react';

interface BackendIntegrationModalProps {
  isOpen: boolean;
  onClose: () => void;
  customBackendUrl: string;
  onSaveBackendUrl: (url: string) => void;
}

export const BackendIntegrationModal: React.FC<BackendIntegrationModalProps> = ({
  isOpen,
  onClose,
  customBackendUrl,
  onSaveBackendUrl
}) => {
  const [copied, setCopied] = useState(false);
  const [inputUrl, setInputUrl] = useState(customBackendUrl);

  if (!isOpen) return null;

  const sampleBackendSnippet = `// express server.ts proxy for LTA Datamall v3 API
import express from 'express';
import fetch from 'node-fetch';

const app = express();
const LTA_API_KEY = process.env.LTA_DATAMALL_KEY;

// Real-time bus arrivals endpoint
app.get('/api/bus-arrival', async (req, res) => {
  try {
    const { BusStopCode, ServiceNo } = req.query;
    let url = \`https://datamall2.mytransport.sg/ltaodataservice/v3/BusArrival?BusStopCode=\${BusStopCode}\`;
    if (ServiceNo) url += \`&ServiceNo=\${ServiceNo}\`;

    const response = await fetch(url, {
      headers: {
        'AccountKey': LTA_API_KEY || '',
        'accept': 'application/json'
      }
    });

    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch LTA bus arrival data' });
  }
});

app.listen(3000);`;

  const handleCopy = () => {
    navigator.clipboard.writeText(sampleBackendSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveBackendUrl(inputUrl);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-900 border border-slate-700/80 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-600/20 text-emerald-400 flex items-center justify-center">
              <Server className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">Backend Connection Setup</h3>
              <p className="text-xs text-slate-400">
                Frontend is 100% ready for Singapore LTA DataMall v3 connection
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable Body */}
        <div className="p-4 sm:p-6 space-y-5 overflow-y-auto">
          {/* Status Box */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">
                  Frontend Ready for Immediate Plug-in
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  The frontend uses identical data structures to official Singapore Land Transport
                  Authority (LTA) DataMall v3 APIs (<code className="text-emerald-400 font-mono">SEA/SDA/LSD</code> load levels, <code className="text-emerald-400 font-mono">SD/DD/BD</code> deck types, and ISO-8601 <code className="text-emerald-400 font-mono">EstimatedArrival</code> timestamps).
                </p>
              </div>
            </div>
          </div>

          {/* Optional Custom API Endpoint URL */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Custom Backend Proxy Endpoint (Optional):</span>
            </label>
            <input
              type="text"
              placeholder="e.g. /api/bus-arrival or https://your-backend.com/api/bus-arrival"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
            <p className="text-[11px] text-slate-400">
              Leave blank to use the built-in real-time Singapore transit simulation engine.
            </p>
          </div>

          {/* Express Proxy Code Snippet */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-slate-400" />
                <span>Express Backend Proxy Snippet</span>
              </span>
              <button
                onClick={handleCopy}
                className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 flex items-center gap-1.5 transition-colors"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 font-mono text-[11px] text-slate-300 overflow-x-auto leading-relaxed">
              {sampleBackendSnippet}
            </pre>
          </div>

          {/* Official API Reference Links */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="font-semibold block">Official LTA DataMall Portal</span>
              <span className="text-slate-400 text-[11px]">Free API keys available for developers</span>
            </div>
            <a
              href="https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <span>View Specs</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 flex items-center justify-end gap-2 shrink-0">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-slate-400 hover:text-white transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-emerald-600 hover:bg-emerald-500 text-white transition-colors shadow-md"
          >
            Save Configuration
          </button>
        </div>
      </div>
    </div>
  );
};
