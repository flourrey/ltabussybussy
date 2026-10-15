import React, { useState } from 'react';
import {
  Server,
  X,
  Code,
  Check,
  Copy,
  ExternalLink,
  Zap,
  Globe,
  Play,
  Activity,
  CheckCircle2,
  AlertCircle
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
  const [testResult, setTestResult] = useState<string | null>(null);
  const [testStatus, setTestStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  if (!isOpen) return null;

  const handleTestEndpoint = async (endpoint: string) => {
    setTestStatus('loading');
    setTestResult(null);
    try {
      const res = await fetch(endpoint, {
        headers: {
          accept: 'application/json'
        }
      });
      const data = await res.json();
      setTestResult(JSON.stringify(data, null, 2));
      setTestStatus(res.ok ? 'success' : 'error');
    } catch (err: any) {
      setTestStatus('error');
      setTestResult(JSON.stringify({ error: 'Request failed', message: err?.message || String(err) }, null, 2));
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSave = () => {
    onSaveBackendUrl(inputUrl);
    onClose();
  };

  const curlExample = `# Test Health Check
curl http://localhost:3000/api/health

# Test LTA Bus Arrival for Bus Stop 83139
curl http://localhost:3000/api/busarrival?BusStopCode=83139`;

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
              <h3 className="text-base font-bold text-white">LTA Serverless API Endpoints</h3>
              <p className="text-xs text-slate-400">
                Serverless handlers stored in <code className="text-emerald-400 font-mono">/api</code> directory
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
          {/* Active Endpoints Banner */}
          <div className="p-4 rounded-xl bg-slate-950/80 border border-emerald-500/30">
            <div className="flex items-start gap-3">
              <Zap className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="text-sm font-bold text-emerald-300">
                  Serverless Functions Installed in Root /api
                </h4>
                <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                  The endpoints have been created in the root <code className="text-emerald-400 font-mono">/api/health.ts</code> and <code className="text-emerald-400 font-mono">/api/busarrival.ts</code>. No API keys are hardcoded.
                </p>
                <div className="mt-2.5 flex flex-wrap gap-2 text-xs">
                  <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-slate-200">
                    GET /api/health
                  </span>
                  <span className="font-mono bg-slate-800 px-2 py-0.5 rounded text-emerald-300">
                    GET /api/busarrival?BusStopCode=83139
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Test Panel */}
          <div className="p-4 rounded-xl bg-slate-950/90 border border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-emerald-400" />
                <span>Test Serverless Endpoints</span>
              </span>
              {testStatus === 'success' && (
                <span className="text-xs text-emerald-400 flex items-center gap-1 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Response 200 OK
                </span>
              )}
              {testStatus === 'error' && (
                <span className="text-xs text-amber-400 flex items-center gap-1 font-semibold">
                  <AlertCircle className="w-3.5 h-3.5" />
                  Key required or error
                </span>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleTestEndpoint('/api/health')}
                disabled={testStatus === 'loading'}
                className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center gap-1.5 border border-slate-700 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5 text-emerald-400" />
                <span>Test /api/health</span>
              </button>

              <button
                onClick={() => handleTestEndpoint('/api/busarrival?BusStopCode=83139')}
                disabled={testStatus === 'loading'}
                className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold text-white flex items-center gap-1.5 transition-colors disabled:opacity-50"
              >
                <Play className="w-3.5 h-3.5" />
                <span>Test /api/busarrival (Stop 83139)</span>
              </button>
            </div>

            {testResult && (
              <pre className="p-3 bg-slate-900 border border-slate-800 rounded-lg text-[11px] font-mono text-slate-300 max-h-48 overflow-y-auto">
                {testResult}
              </pre>
            )}
          </div>

          {/* Environment Variable Setup */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
                <Code className="w-4 h-4 text-slate-400" />
                <span>How to Add Your Key Later</span>
              </span>
              <button
                onClick={() => handleCopy(curlExample)}
                className="px-2 py-1 text-xs font-semibold rounded bg-slate-800 text-slate-300 hover:text-white flex items-center gap-1"
              >
                {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                <span>{copied ? 'Copied!' : 'Copy cURL'}</span>
              </button>
            </div>

            <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-2 leading-relaxed">
              <p>
                Add your LTA DataMall AccountKey to your environment variables or <code className="text-emerald-400 font-mono">.env</code>:
              </p>
              <pre className="p-2 bg-slate-900 rounded font-mono text-[11px] text-emerald-400">
                LTA_ACCOUNT_KEY=&quot;YOUR_LTA_DATAMALL_KEY&quot;
              </pre>
              <p className="text-[11px] text-slate-400">
                The function automatically detects <code className="font-mono text-slate-300">LTA_ACCOUNT_KEY</code> or an incoming <code className="font-mono text-slate-300">AccountKey</code> header.
              </p>
            </div>
          </div>

          {/* Custom Backend URL override */}
          <div className="space-y-2">
            <label className="text-xs font-semibold text-slate-300 flex items-center gap-1.5">
              <Globe className="w-4 h-4 text-emerald-400" />
              <span>Custom Endpoint Override (Optional):</span>
            </label>
            <input
              type="text"
              placeholder="e.g. /api/busarrival or https://your-serverless-url.com/api/busarrival"
              value={inputUrl}
              onChange={e => setInputUrl(e.target.value)}
              className="w-full px-3.5 py-2 bg-slate-950 border border-slate-700 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 font-mono"
            />
          </div>

          {/* Official API Reference Links */}
          <div className="p-3.5 rounded-xl bg-slate-800/50 border border-slate-700/60 flex items-center justify-between text-xs text-slate-300">
            <div>
              <span className="font-semibold block">Official LTA DataMall Portal</span>
              <span className="text-slate-400 text-[11px]">Request a free AccountKey anytime</span>
            </div>
            <a
              href="https://datamall.lta.gov.sg/content/datamall/en/dynamic-data.html"
              target="_blank"
              rel="noreferrer"
              className="text-emerald-400 hover:text-emerald-300 flex items-center gap-1 font-semibold"
            >
              <span>LTA Portal</span>
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
            Close
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
