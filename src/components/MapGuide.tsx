import React, { useState, useEffect } from 'react';
import { Map as MapIcon, Info, Eye, Shield, Zap, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { getMaps } from '../services/valorantService';

type MapSpot = {
  id: string;
  title: string;
  description: string;
  type: 'Angle' | 'Ability' | 'Tactic';
  difficulty: 'Easy' | 'Medium' | 'Hard';
};

const TACTICAL_SPOTS: Record<string, MapSpot[]> = {
  'Haven': [
    { id: 'h1', title: 'A Long Off-Angle', description: 'Stand on the bricks near the orb to catch players pushing from A Long. They rarely check this height.', type: 'Angle', difficulty: 'Easy' },
    { id: 'h2', title: 'C Site Retake Smoke', description: 'Omen smoke from C Link to Garage to isolate C Site during retakes.', type: 'Ability', difficulty: 'Medium' },
  ],
  'Bind': [
    { id: 'b1', title: 'Hookah One-Way', description: 'Cyber Cage placement on the window frame for a perfect one-way smoke.', type: 'Ability', difficulty: 'Medium' },
    { id: 'b2', title: 'B Short Aggressive Peek', description: 'Using a Jett dash to catch attackers before they reach the teleporter.', type: 'Tactic', difficulty: 'Hard' },
  ],
  'Ascent': [
    { id: 'a1', title: 'B Main Wallbang', description: 'Odin spam through the B Main wall to stop the rush. High success rate.', type: 'Tactic', difficulty: 'Easy' },
    { id: 'a2', title: 'Mid Courtyard Jump Peek', description: 'Jump peeking Mid to gather info without committing to a fight.', type: 'Angle', difficulty: 'Medium' },
  ]
};

export default function MapGuide() {
  const [maps, setMaps] = useState<any[]>([]);
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const [selectedSpot, setSelectedSpot] = useState<MapSpot | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getMaps();
        // Filter out maps without splash images or mini-maps
        const validMaps = data.filter((m: any) => m.splash && m.displayIcon);
        setMaps(validMaps);
        setSelectedMap(validMaps[0]);
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

  const currentSpots = TACTICAL_SPOTS[selectedMap?.displayName] || [];

  return (
    <div className="flex flex-col gap-6 p-6 glass-panel tactical-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MapIcon className="w-6 h-6 text-valorant-blue" />
          <h2 className="text-2xl">Tactical Map Guide</h2>
        </div>
        <div className="flex gap-2 max-w-[50%] overflow-x-auto pb-2 scrollbar-none">
          {maps.map(map => (
            <button
              key={map.uuid}
              onClick={() => { setSelectedMap(map); setSelectedSpot(null); }}
              className={`px-4 py-1 text-sm font-mono uppercase tracking-widest transition-colors shrink-0 ${
                selectedMap?.uuid === map.uuid 
                  ? 'bg-valorant-blue text-white' 
                  : 'bg-white/5 hover:bg-white/10 text-valorant-gray/60'
              }`}
            >
              {map.displayName}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 space-y-4">
          <div className="relative aspect-video rounded overflow-hidden border border-white/10">
            <img src={selectedMap?.splash} className="w-full h-full object-cover opacity-60" alt="" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
            <div className="absolute bottom-2 left-2">
              <span className="text-xs font-mono uppercase opacity-60">Coordinates</span>
              <div className="text-sm font-bold">{selectedMap?.coordinates || 'Unknown'}</div>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-[10px] opacity-50 font-mono uppercase">Tactical Spots</h3>
            {currentSpots.length > 0 ? (
              currentSpots.map(spot => (
                <button
                  key={spot.id}
                  onClick={() => setSelectedSpot(spot)}
                  className={`w-full text-left p-3 border transition-all ${
                    selectedSpot?.id === spot.id
                      ? 'border-valorant-blue bg-valorant-blue/10'
                      : 'border-white/5 bg-white/5 hover:bg-white/10'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-bold">{spot.title}</span>
                    {spot.type === 'Angle' && <Eye className="w-3 h-3 text-valorant-blue" />}
                    {spot.type === 'Ability' && <Zap className="w-3 h-3 text-valorant-red" />}
                    {spot.type === 'Tactic' && <Shield className="w-3 h-3 text-green-400" />}
                  </div>
                  <div className="flex gap-2">
                    <span className="text-[10px] uppercase font-mono px-1 bg-black/40 rounded">
                      {spot.difficulty}
                    </span>
                  </div>
                </button>
              ))
            ) : (
              <div className="p-4 text-center text-xs opacity-30 italic border border-dashed border-white/10">
                No tactical data available for this sector yet.
              </div>
            )}
          </div>
        </div>

        <div className="md:col-span-2 relative min-h-[400px] bg-black/40 rounded-lg border border-white/5 overflow-hidden flex items-center justify-center">
          {/* Mini map background */}
          {selectedMap?.displayIcon && (
            <img 
              src={selectedMap.displayIcon} 
              className="absolute w-full h-full object-contain opacity-20 p-8" 
              alt="Mini Map" 
            />
          )}

          <AnimatePresence mode="wait">
            {selectedSpot ? (
              <motion.div
                key={selectedSpot.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="relative z-10 max-w-md text-center p-8 glass-panel"
              >
                <div className="inline-block p-3 rounded-full bg-valorant-blue/20 mb-4">
                  <Info className="w-8 h-8 text-valorant-blue" />
                </div>
                <h4 className="text-xl mb-2">{selectedSpot.title}</h4>
                <p className="text-valorant-gray/70 leading-relaxed">
                  {selectedSpot.description}
                </p>
                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 text-[10px] uppercase font-mono">
                  <div>
                    <div className="opacity-40 mb-1">Execution</div>
                    <div className="text-valorant-blue">High Reward</div>
                  </div>
                  <div>
                    <div className="opacity-40 mb-1">Risk Level</div>
                    <div className="text-valorant-red">Moderate</div>
                  </div>
                  <div>
                    <div className="opacity-40 mb-1">Frequency</div>
                    <div className="text-green-400">Situational</div>
                  </div>
                </div>
              </motion.div>
            ) : (
              <div className="text-center opacity-30 z-10">
                <MapIcon className="w-16 h-16 mx-auto mb-4" />
                <p className="uppercase tracking-[0.2em] text-sm">Select a tactical spot to analyze</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
