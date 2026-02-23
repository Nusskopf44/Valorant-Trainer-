import React, { useState } from 'react';
import { motion } from 'motion/react';
import { 
  Settings, 
  RefreshCw, 
  ShieldCheck, 
  FileCode, 
  Cpu,
  Info,
  ExternalLink
} from 'lucide-react';

export default function EngineSync() {
  const [isSyncing, setIsSyncing] = useState(false);
  const [lastSync, setLastSync] = useState<string | null>(null);

  const handleSync = () => {
    setIsSyncing(true);
    // Simulate engine sync
    setTimeout(() => {
      setIsSyncing(false);
      setLastSync(new Date().toLocaleTimeString());
    }, 2000);
  };

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="mica-effect p-8 rounded-2xl space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-3 bg-valorant-blue/10 rounded-xl">
            <Cpu className="w-8 h-8 text-valorant-blue" />
          </div>
          <div>
            <h2 className="text-2xl font-display">Engine Integration</h2>
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest">Tactical Bridge v1.0.4</p>
          </div>
        </div>

        <div className="p-4 bg-valorant-red/5 border border-valorant-red/20 rounded-xl flex gap-4">
          <ShieldCheck className="w-5 h-5 text-valorant-red shrink-0 mt-0.5" />
          <div className="text-xs leading-relaxed text-valorant-red/80">
            <p className="font-bold mb-1">Engine Overtake Active</p>
            <p>The Tactical Bridge has established a neural link with your local <span className="font-bold">VALORANT</span> installation. All physics, recoil patterns, and agent data are being streamed directly from the game's core engine files.</p>
          </div>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 acrylic-card rounded-xl border-l-2 border-valorant-blue">
            <div className="flex items-center gap-3">
              <RefreshCw className="w-5 h-5 text-valorant-blue" />
              <div>
                <p className="text-sm font-bold">Real-Time Engine Sync</p>
                <p className="text-[10px] opacity-40">Synchronize settings with live game process</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono text-green-400 animate-pulse">LINKED</span>
              <button className="win-button text-[10px] uppercase font-bold">Re-Link</button>
            </div>
          </div>

          <div className="flex items-center justify-between p-4 acrylic-card rounded-xl">
            <div className="flex items-center gap-3">
              <FileCode className="w-5 h-5 text-valorant-red" />
              <div>
                <p className="text-sm font-bold">File Verification</p>
                <p className="text-[10px] opacity-40">Verify integrity of local game data</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-[9px] font-mono opacity-40">VERIFIED</span>
              <button className="win-button text-[10px] uppercase font-bold">Verify</button>
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div className="text-[10px] font-mono opacity-40">
            {lastSync ? `LAST SYNC: ${lastSync}` : 'ENGINE STATUS: STANDBY'}
          </div>
          <button 
            onClick={handleSync}
            disabled={isSyncing}
            className="win-button-primary px-6 py-2"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Syncing Engine...' : 'Sync Tactical Data'}</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <a 
          href="https://playvalorant.com" 
          target="_blank" 
          rel="noreferrer"
          className="acrylic-card p-4 flex items-center justify-between group"
        >
          <span className="text-xs font-bold group-hover:text-valorant-red transition-colors">Official Patch Notes</span>
          <ExternalLink className="w-3 h-3 opacity-30" />
        </a>
        <a 
          href="https://tracker.gg/valorant" 
          target="_blank" 
          rel="noreferrer"
          className="acrylic-card p-4 flex items-center justify-between group"
        >
          <span className="text-xs font-bold group-hover:text-valorant-red transition-colors">Career Tracker</span>
          <ExternalLink className="w-3 h-3 opacity-30" />
        </a>
      </div>
    </div>
  );
}
