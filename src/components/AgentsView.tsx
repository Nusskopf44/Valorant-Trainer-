import React, { useState, useEffect } from 'react';
import { User, Loader2, Zap, Shield, Eye, Target } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getAgents } from '../services/valorantService';

export default function AgentsView() {
  const [agents, setAgents] = useState<any[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getAgents();
        setAgents(data);
        setSelectedAgent(data[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="h-[400px] flex items-center justify-center glass-panel tactical-border">
        <Loader2 className="w-8 h-8 animate-spin text-valorant-red" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 p-6 glass-panel tactical-border min-h-[600px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <User className="w-6 h-6 text-valorant-red" />
          <h2 className="text-2xl">Agent Dossiers</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Agent List */}
        <div className="lg:col-span-3 space-y-1 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
          {agents.map(agent => (
            <button
              key={agent.uuid}
              onClick={() => setSelectedAgent(agent)}
              className={`w-full text-left px-4 py-3 text-sm transition-all flex items-center gap-3 group ${
                selectedAgent?.uuid === agent.uuid
                  ? 'bg-valorant-red text-white'
                  : 'bg-white/5 hover:bg-white/10 text-valorant-gray/60'
              }`}
            >
              <img src={agent.displayIcon} className="w-8 h-8 rounded bg-black/40" alt="" />
              <span className="font-display uppercase tracking-wider">{agent.displayName}</span>
            </button>
          ))}
        </div>

        {/* Agent Detail */}
        <div className="lg:col-span-9 relative">
          <AnimatePresence mode="wait">
            <motion.div
              key={selectedAgent?.uuid}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="grid grid-cols-1 md:grid-cols-2 gap-8"
            >
              <div className="relative aspect-[3/4] rounded-lg overflow-hidden bg-black/40 border border-white/10">
                <img 
                  src={selectedAgent?.fullPortrait} 
                  className="absolute inset-0 w-full h-full object-contain z-10" 
                  alt={selectedAgent?.displayName} 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-valorant-dark via-transparent to-transparent z-20" />
                <div className="absolute top-4 left-4 z-30">
                  <div className="text-[10px] font-mono uppercase opacity-60 mb-1">Role</div>
                  <div className="flex items-center gap-2 px-3 py-1 bg-black/60 rounded border border-white/10">
                    <img src={selectedAgent?.role?.displayIcon} className="w-4 h-4 invert" alt="" />
                    <span className="text-xs font-bold uppercase tracking-widest">{selectedAgent?.role?.displayName}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-8">
                <div>
                  <h3 className="text-5xl font-display mb-2">{selectedAgent?.displayName}</h3>
                  <p className="text-valorant-gray/60 text-sm leading-relaxed italic">
                    "{selectedAgent?.description}"
                  </p>
                </div>

                <div className="space-y-4">
                  <h4 className="text-xs font-mono uppercase opacity-40 tracking-widest">Abilities</h4>
                  <div className="grid grid-cols-1 gap-4">
                    {selectedAgent?.abilities.map((ability: any, idx: number) => (
                      <div key={idx} className="p-4 bg-white/5 border border-white/5 rounded group hover:bg-white/10 transition-all">
                        <div className="flex items-center gap-4 mb-2">
                          <div className="w-10 h-10 p-2 bg-black/40 rounded border border-white/10">
                            {ability.displayIcon ? (
                              <img src={ability.displayIcon} className="w-full h-full object-contain" alt="" />
                            ) : (
                              <Zap className="w-full h-full text-valorant-red" />
                            )}
                          </div>
                          <div>
                            <div className="text-xs font-mono uppercase text-valorant-red">{ability.slot}</div>
                            <div className="font-bold uppercase tracking-wider">{ability.displayName}</div>
                          </div>
                        </div>
                        <p className="text-xs text-valorant-gray/50 leading-relaxed">
                          {ability.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
