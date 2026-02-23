import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Zap, 
  Target, 
  Move, 
  Timer, 
  ChevronRight, 
  Play, 
  Star,
  Layers,
  Dna,
  Loader2,
  Info,
  RotateCcw,
  Map as MapIcon
} from 'lucide-react';
import { getMaps } from '../services/valorantService';

export type LevelCategory = 'Precision' | 'Speed' | 'Tracking' | 'Reaction' | 'Flick';

export type LevelConfig = {
  id: string;
  name: string;
  category: LevelCategory;
  difficulty: number;
  mapUuid: string;
  mapName: string;
  mapSplash: string;
  objective: string;
  options: {
    targetSize: number;
    spawnRate: number;
    lifespan: number;
    duration: number;
    movingTargets?: boolean;
    targetSpeed?: number;
    botCount: number;
    scenarioType: 'Retake' | 'Entry' | 'Hold' | 'Execute';
  };
};

const SCENARIO_TYPES: LevelConfig['options']['scenarioType'][] = ['Retake', 'Entry', 'Hold', 'Execute'];

const CATEGORIES: { id: LevelCategory; icon: any; color: string; desc: string }[] = [
  { id: 'Precision', icon: Target, color: 'text-blue-400', desc: 'Small targets, high accuracy required.' },
  { id: 'Speed', icon: Zap, color: 'text-yellow-400', desc: 'Fast spawns, rapid target switching.' },
  { id: 'Tracking', icon: Move, color: 'text-green-400', desc: 'Moving targets that require constant focus.' },
  { id: 'Reaction', icon: Timer, color: 'text-purple-400', desc: 'Targets appear and disappear instantly.' },
  { id: 'Flick', icon: Dna, color: 'text-valorant-red', desc: 'Wide angle target switching.' },
];

export default function LevelGenerator({ onStartLevel }: { onStartLevel: (config: LevelConfig) => void }) {
  const [selectedCategory, setSelectedCategory] = useState<LevelCategory>('Precision');
  const [seed, setSeed] = useState(Math.floor(Math.random() * 1000000));
  const [maps, setMaps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMaps() {
      try {
        const data = await getMaps();
        setMaps(data.filter((m: any) => m.displayIcon && m.splash));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMaps();
  }, []);

  const [hoveredLevel, setHoveredLevel] = useState<string | null>(null);

  // Generate "Infinite" levels based on seed and category
  const levels = useMemo(() => {
    if (maps.length === 0) return [];
    
    return Array.from({ length: 12 }).map((_, i) => {
      const levelSeed = seed + i;
      const difficulty = Math.min(100, (i + 1) * 8 + (levelSeed % 20));
      const map = maps[levelSeed % maps.length];
      const scenarioType = SCENARIO_TYPES[levelSeed % SCENARIO_TYPES.length];
      
      const config: LevelConfig = {
        id: `gen-${levelSeed}`,
        name: `${map.displayName}: ${scenarioType} Alpha`,
        category: selectedCategory,
        difficulty,
        mapUuid: map.uuid,
        mapName: map.displayName,
        mapSplash: map.splash,
        objective: `${scenarioType} the ${['A', 'B', 'C', 'Mid'][levelSeed % 4]} sector against AI defenders.`,
        options: {
          targetSize: Math.max(8, 25 - (difficulty / 6)),
          spawnRate: Math.max(150, 1200 - (difficulty * 10)),
          lifespan: Math.max(300, 2500 - (difficulty * 20)),
          duration: 45,
          movingTargets: difficulty > 40,
          targetSpeed: (difficulty / 25) + 0.5,
          botCount: Math.floor(difficulty / 20) + 2,
          scenarioType
        }
      };
      return config;
    });
  }, [selectedCategory, seed, maps]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-valorant-red" />
          <div className="absolute inset-0 blur-xl bg-valorant-red/20 animate-pulse" />
        </div>
        <p className="text-xs font-mono font-black uppercase tracking-[0.4em] opacity-30">Initializing Tactical Engine...</p>
      </div>
    );
  }

  return (
    <div className="space-y-12 max-w-7xl mx-auto">
      <div className="flex items-center justify-between">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <span className="text-xs font-mono font-black text-valorant-red uppercase tracking-[0.5em] mb-2 block">Procedural Generation</span>
          <h2 className="text-5xl font-display font-black tracking-tighter leading-tight">Tactical <span className="text-glow">Engine</span></h2>
          <p className="text-white/30 text-sm mt-2">Infinite training scenarios generated from real game data.</p>
        </motion.div>
        
        <button 
          onClick={() => setSeed(Math.floor(Math.random() * 1000000))}
          className="win-button group px-8 py-4 rounded-2xl"
        >
          <RotateCcw className="w-5 h-5 group-hover:rotate-180 transition-transform duration-700" />
          <span className="font-bold uppercase tracking-widest text-xs">Regenerate Seed</span>
        </button>
      </div>

      {/* Categories */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-6">
        {CATEGORIES.map((cat, idx) => (
          <motion.button
            key={cat.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            onClick={() => setSelectedCategory(cat.id)}
            className={`acrylic-card p-8 text-left group relative overflow-hidden rounded-[2rem] ${
              selectedCategory === cat.id ? 'ring-2 ring-valorant-red/50 bg-white/10' : ''
            }`}
          >
            {selectedCategory === cat.id && (
              <div className="absolute inset-0 bg-gradient-to-br from-valorant-red/10 to-transparent pointer-events-none" />
            )}
            <cat.icon className={`w-10 h-10 mb-6 transition-transform duration-500 group-hover:scale-110 ${cat.color} ${selectedCategory === cat.id ? 'drop-shadow-[0_0_10px_rgba(255,255,255,0.3)]' : ''}`} />
            <h3 className="font-black text-lg mb-2 tracking-tight">{cat.id}</h3>
            <p className="text-[11px] opacity-30 font-medium leading-relaxed">{cat.desc}</p>
          </motion.button>
        ))}
      </div>

      {/* Level List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-xs font-mono font-black uppercase opacity-30 tracking-[0.3em]">Sector Manifest</h3>
            <span className="text-[10px] font-mono font-black opacity-20 uppercase tracking-widest">Seed: {seed}</span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            {levels.map((level, idx) => (
              <motion.div
                key={level.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 + 0.5 }}
                onMouseEnter={() => setHoveredLevel(level.id)}
                onMouseLeave={() => setHoveredLevel(null)}
                className="acrylic-card p-8 flex items-center justify-between group cursor-pointer rounded-[2rem] hover:border-valorant-red/20"
                onClick={() => onStartLevel(level)}
              >
                <div className="flex items-center gap-8">
                  <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center font-mono text-sm font-black border border-white/5 group-hover:border-valorant-red/30 transition-colors">
                    <span className={level.difficulty > 70 ? 'text-valorant-red' : level.difficulty > 40 ? 'text-valorant-blue' : 'text-green-400'}>
                      {level.difficulty}%
                    </span>
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-2">
                      <h4 className="text-xl font-black tracking-tight group-hover:text-valorant-red transition-colors">{level.name}</h4>
                      <span className="text-[10px] px-3 py-1 bg-valorant-red/10 text-valorant-red rounded-lg font-mono font-black uppercase tracking-widest border border-valorant-red/20">
                        {level.options.scenarioType}
                      </span>
                    </div>
                    <p className="text-sm opacity-30 font-medium mb-4 italic leading-relaxed">{level.objective}</p>
                    <div className="flex gap-6 text-[10px] font-mono font-black opacity-20 uppercase tracking-widest">
                      <span className="flex items-center gap-2"><MapIcon className="w-3 h-3" /> {level.mapName}</span>
                      <span className="flex items-center gap-2"><Target className="w-3 h-3" /> {level.options.targetSize.toFixed(1)}px</span>
                      <span className="flex items-center gap-2"><Timer className="w-3 h-3" /> {level.options.spawnRate}ms</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-8">
                  <div className="flex gap-1.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star 
                        key={i} 
                        className={`w-4 h-4 transition-all duration-500 ${i < Math.ceil(level.difficulty / 20) ? 'text-yellow-400 fill-yellow-400 drop-shadow-[0_0_8px_rgba(250,204,21,0.4)]' : 'text-white/5'}`} 
                      />
                    ))}
                  </div>
                  <button className="win-button-primary w-14 h-14 rounded-2xl flex items-center justify-center p-0">
                    <Play className="w-6 h-6 fill-current translate-x-0.5" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preview Panel */}
        <div className="hidden lg:block relative">
          <div className="sticky top-12">
            <AnimatePresence mode="wait">
              {hoveredLevel ? (
                <motion.div
                  key={hoveredLevel}
                  initial={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                  animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, scale: 0.9, filter: 'blur(20px)' }}
                  transition={{ duration: 0.5, ease: [0.2, 0.8, 0.2, 1] }}
                  className="mica-effect rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/10"
                >
                  <div className="aspect-[4/5] relative">
                    <img 
                      src={levels.find(l => l.id === hoveredLevel)?.mapSplash} 
                      alt="Map Preview"
                      className="w-full h-full object-cover scale-110 group-hover:scale-100 transition-transform duration-1000"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                    <div className="absolute bottom-10 left-10 right-10">
                      <span className="text-[10px] font-mono font-black uppercase text-valorant-red tracking-[0.4em] mb-3 block">Tactical Intel</span>
                      <h4 className="text-4xl font-display font-black tracking-tighter mb-6">{levels.find(l => l.id === hoveredLevel)?.mapName}</h4>
                      
                      <div className="space-y-6">
                        <div className="p-6 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                          <div className="flex items-center gap-3 mb-3">
                            <Info className="w-4 h-4 text-valorant-red" />
                            <h5 className="text-[10px] font-mono font-black uppercase tracking-widest opacity-60">Briefing</h5>
                          </div>
                          <p className="text-sm text-white/60 leading-relaxed font-medium">
                            {levels.find(l => l.id === hoveredLevel)?.objective}
                          </p>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                            <p className="text-[9px] font-mono font-black opacity-30 uppercase tracking-widest mb-1">AI Units</p>
                            <p className="text-xl font-black">{levels.find(l => l.id === hoveredLevel)?.options.botCount} Defenders</p>
                          </div>
                          <div className="p-5 bg-white/5 backdrop-blur-md rounded-2xl border border-white/5">
                            <p className="text-[9px] font-mono font-black opacity-30 uppercase tracking-widest mb-1">Complexity</p>
                            <p className="text-xl font-black text-valorant-red">{levels.find(l => l.id === hoveredLevel)?.difficulty}%</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="mica-effect rounded-[2.5rem] p-20 flex flex-col items-center justify-center text-center space-y-8 border border-white/5"
                >
                  <div className="w-24 h-24 rounded-3xl bg-white/5 flex items-center justify-center relative">
                    <Layers className="w-10 h-10 opacity-20" />
                    <div className="absolute inset-0 border-2 border-white/5 rounded-3xl animate-ping opacity-10" />
                  </div>
                  <div className="space-y-2">
                    <p className="text-xs font-mono font-black uppercase tracking-[0.4em] opacity-20">Awaiting Input</p>
                    <p className="text-sm text-white/10 font-bold">Select a sector to preview tactical data</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}
