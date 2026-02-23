import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Crosshair, 
  Map as MapIcon, 
  Shield, 
  Sword, 
  Info, 
  ExternalLink,
  Play,
  RotateCcw,
  ChevronLeft,
  Terminal,
  Users,
  Loader2
} from 'lucide-react';
import { LevelConfig } from './LevelGenerator';
import { getMaps } from '../services/valorantService';

export default function TacticalSimulator({ config, onBack }: { config: LevelConfig, onBack: () => void }) {
  const [mapData, setMapData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [gameState, setGameState] = useState<'briefing' | 'active' | 'complete'>('briefing');
  const [score, setScore] = useState(0);
  const [botsEliminated, setBotsEliminated] = useState(0);
  const [timer, setTimer] = useState(config.options.duration);

  useEffect(() => {
    async function fetchMap() {
      try {
        const maps = await getMaps();
        const found = maps.find((m: any) => m.uuid === config.mapUuid);
        setMapData(found);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchMap();
  }, [config.mapUuid]);

  useEffect(() => {
    if (gameState === 'active' && timer > 0) {
      const interval = setInterval(() => {
        setTimer(t => {
          if (t <= 1) {
            setGameState('complete');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameState, timer]);

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-valorant-red" />
          <div className="absolute inset-0 blur-xl bg-valorant-red/20 animate-pulse" />
        </div>
        <p className="text-xs font-mono font-black uppercase tracking-[0.4em] opacity-30">Initializing Tactical Bridge...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <button 
          onClick={onBack}
          className="win-button group px-6 py-3 rounded-2xl flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-60 hover:opacity-100 transition-all"
        >
          <ChevronLeft className="w-5 h-5 transition-transform group-hover:-translate-x-1" />
          <span>Back to Engine</span>
        </button>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <h2 className="text-3xl font-display font-black uppercase tracking-tighter">{config.name}</h2>
            <p className="text-[10px] font-mono font-black opacity-30 uppercase tracking-[0.3em]">Sector: {config.mapName}</p>
          </div>
          <div className="w-14 h-14 bg-valorant-red/10 rounded-2xl flex items-center justify-center border border-valorant-red/20 shadow-[0_0_20px_rgba(255,70,85,0.1)]">
            <MapIcon className="w-8 h-8 text-valorant-red" />
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Tactical Map View */}
        <div className="lg:col-span-2 space-y-8">
          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="relative aspect-video bg-[#0a0a0a] rounded-[2.5rem] overflow-hidden border border-white/5 shadow-2xl group"
          >
            {/* Map Background */}
            <img 
              src={mapData?.displayIcon} 
              alt={config.mapName}
              className="absolute inset-0 w-full h-full object-contain opacity-10 p-20 transition-all duration-1000 group-hover:opacity-20 group-hover:scale-105"
              referrerPolicy="no-referrer"
            />

            {/* Simulation Layer */}
            <AnimatePresence mode="wait">
              {gameState === 'briefing' && (
                <motion.div 
                  key="briefing"
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(12px)' }}
                  exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  className="absolute inset-0 flex items-center justify-center bg-black/40 p-12"
                >
                  <motion.div 
                    initial={{ y: 40, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    className="max-w-xl text-center space-y-10"
                  >
                    <div className="space-y-4">
                      <div className="inline-block px-4 py-1.5 bg-valorant-red/10 border border-valorant-red/20 rounded-full">
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-valorant-red">Mission Briefing</span>
                      </div>
                      <h3 className="text-5xl font-display font-black uppercase tracking-tighter">Operation {config.name.split(' ')[0]}</h3>
                      <p className="text-white/40 text-lg leading-relaxed font-medium">{config.objective}</p>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-6">
                      <div className="mica-effect p-8 rounded-[2rem] text-left border border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-valorant-blue/10 flex items-center justify-center mb-4">
                          <Users className="w-6 h-6 text-valorant-blue" />
                        </div>
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">AI Defenders</p>
                        <p className="text-3xl font-black">{config.options.botCount}</p>
                      </div>
                      <div className="mica-effect p-8 rounded-[2rem] text-left border border-white/5">
                        <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center mb-4">
                          <Shield className="w-6 h-6 text-green-400" />
                        </div>
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-1">Difficulty</p>
                        <p className="text-3xl font-black">{config.difficulty}%</p>
                      </div>
                    </div>

                    <button 
                      onClick={() => setGameState('active')}
                      className="win-button-primary w-full py-6 text-2xl rounded-[1.5rem] group shadow-[0_20px_40px_rgba(255,70,85,0.2)]"
                    >
                      <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" />
                      <span className="font-black uppercase tracking-widest">Begin Simulation</span>
                    </button>
                  </motion.div>
                </motion.div>
              )}

              {gameState === 'active' && (
                <motion.div 
                  key="active"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="absolute inset-0 pointer-events-none"
                >
                  {/* HUD */}
                  <div className="absolute top-10 left-10 right-10 flex justify-between items-start">
                    <motion.div 
                      initial={{ x: -40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="mica-effect px-8 py-4 flex items-center gap-8 rounded-3xl border border-white/10 shadow-2xl"
                    >
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Eliminations</span>
                        <span className="text-3xl font-black text-valorant-red">{botsEliminated} <span className="text-white/20 text-xl">/ {config.options.botCount}</span></span>
                      </div>
                      <div className="w-px h-12 bg-white/10" />
                      <div className="flex flex-col">
                        <span className="text-[10px] font-black opacity-30 uppercase tracking-widest">Time Remaining</span>
                        <span className={`text-3xl font-black transition-colors ${timer < 10 ? 'text-valorant-red animate-pulse' : ''}`}>{timer}s</span>
                      </div>
                    </motion.div>

                    <motion.div 
                      initial={{ x: 40, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      className="mica-effect px-8 py-4 rounded-3xl border border-white/10 shadow-2xl flex items-center gap-4"
                    >
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse" />
                      <span className="text-xs font-black uppercase tracking-widest">Engine Live</span>
                    </motion.div>
                  </div>

                  {/* Placeholder for interactive simulation elements */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="relative">
                      <p className="text-white/10 text-xl font-display font-black uppercase tracking-[1em] animate-pulse">
                        Tactical Simulation Active
                      </p>
                      <div className="absolute inset-0 blur-3xl bg-valorant-red/5 animate-pulse" />
                    </div>
                  </div>
                </motion.div>
              )}

              {gameState === 'complete' && (
                <motion.div 
                  key="complete"
                  initial={{ opacity: 0, backdropFilter: 'blur(0px)' }}
                  animate={{ opacity: 1, backdropFilter: 'blur(24px)' }}
                  className="absolute inset-0 flex items-center justify-center bg-black/60 p-12"
                >
                  <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-xl text-center space-y-12"
                  >
                    <div className="space-y-4">
                      <h3 className="text-7xl font-display font-black uppercase tracking-tighter">Debriefing</h3>
                      <p className="text-white/40 font-bold uppercase tracking-[0.4em] text-sm">Simulation Concluded</p>
                    </div>

                    <div className="grid grid-cols-2 gap-8">
                      <div className="mica-effect p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2">Combat Score</p>
                        <p className="text-6xl font-black text-valorant-red">{score}</p>
                      </div>
                      <div className="mica-effect p-10 rounded-[2.5rem] border border-white/5 shadow-2xl">
                        <p className="text-[10px] font-black opacity-30 uppercase tracking-widest mb-2">AI Defeated</p>
                        <p className="text-6xl font-black">{botsEliminated}</p>
                      </div>
                    </div>

                    <div className="flex gap-6">
                      <button 
                        onClick={() => {
                          setGameState('briefing');
                          setBotsEliminated(0);
                          setScore(0);
                          setTimer(config.options.duration);
                        }}
                        className="win-button flex-1 py-6 rounded-2xl group"
                      >
                        <RotateCcw className="w-6 h-6 transition-transform group-hover:rotate-180 duration-500" />
                        <span className="font-black uppercase tracking-widest">Retry Operation</span>
                      </button>
                      <button 
                        onClick={onBack}
                        className="win-button-primary flex-1 py-6 rounded-2xl"
                      >
                        <span className="font-black uppercase tracking-widest">Return to Hub</span>
                      </button>
                    </div>
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mica-effect p-10 rounded-[2.5rem] border border-white/5 shadow-2xl relative overflow-hidden group"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-valorant-blue/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="relative z-10">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-valorant-blue/10 flex items-center justify-center">
                  <Info className="w-6 h-6 text-valorant-blue" />
                </div>
                <h4 className="font-display font-black uppercase tracking-widest">Tactical Advice</h4>
              </div>
              <p className="text-lg text-white/50 leading-relaxed font-medium">
                In this <span className="text-white">{config.options.scenarioType}</span> scenario, focus on clearing common angles one by one. Use your utility to isolate defenders and force 1v1 engagements. The AI defenders will react to your presence, so maintain crosshair placement at head level.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Real VALORANT Integration Guide */}
        <div className="space-y-8">
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="mica-effect p-10 rounded-[2.5rem] space-y-10 border-l-8 border-valorant-red shadow-2xl"
          >
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 rounded-2xl bg-valorant-red/10 flex items-center justify-center">
                <Terminal className="w-8 h-8 text-valorant-red" />
              </div>
              <h3 className="text-2xl font-display font-black uppercase tracking-tighter">VALORANT Bridge</h3>
            </div>
            
            <p className="text-sm text-white/40 leading-relaxed font-medium">
              To train this exact scenario with real game physics and engine, follow these steps in your installed VALORANT client:
            </p>

            <div className="space-y-8">
              <div className="space-y-4">
                <p className="text-[10px] font-mono font-black uppercase opacity-30 tracking-[0.3em]">1. Custom Game Setup</p>
                <div className="mica-effect p-6 rounded-2xl space-y-4 border border-white/5">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Map:</span>
                    <span className="text-sm font-black text-valorant-red">{config.mapName}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Mode:</span>
                    <span className="text-sm font-black">Standard</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold opacity-40 uppercase tracking-widest">Cheats:</span>
                    <span className="text-sm font-black text-green-400">ENABLED</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-mono font-black uppercase opacity-30 tracking-[0.3em]">2. Training Commands</p>
                <div className="bg-black/60 p-6 rounded-2xl font-mono text-[11px] space-y-3 border border-white/5 shadow-inner">
                  <p className="text-valorant-red font-black mb-2 tracking-widest">// CONSOLE COMMANDS</p>
                  <p className="text-white/60">/pause_match</p>
                  <p className="text-white/60">/infinite_abilities on</p>
                  <p className="text-white/60">/infinite_ammo on</p>
                  <p className="text-white/60">/ghost</p>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-[10px] font-mono font-black uppercase opacity-30 tracking-[0.3em]">3. Scenario Objective</p>
                <div className="p-6 bg-valorant-red/[0.03] border border-valorant-red/10 rounded-2xl italic">
                  <p className="text-sm font-medium opacity-80 leading-relaxed">"{config.objective}"</p>
                </div>
              </div>
            </div>

            <button className="win-button-primary w-full py-5 rounded-2xl group">
              <ExternalLink className="w-5 h-5 transition-transform group-hover:scale-110" />
              <span className="font-black uppercase tracking-widest text-xs">Copy Setup Config</span>
            </button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="mica-effect p-10 rounded-[2.5rem] space-y-8 border border-white/5 shadow-2xl"
          >
            <h4 className="text-sm font-black uppercase tracking-[0.3em] flex items-center gap-3">
              <Sword className="w-5 h-5 text-valorant-blue" />
              AI Profile
            </h4>
            <div className="space-y-6">
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono font-black uppercase opacity-30 tracking-widest">
                  <span>Reaction Time</span>
                  <span className="text-valorant-blue">{Math.max(150, 400 - config.difficulty * 2)}ms</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-valorant-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(100, (config.difficulty / 100) * 100)}%` }}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between text-[10px] font-mono font-black uppercase opacity-30 tracking-widest">
                  <span>Accuracy</span>
                  <span className="text-valorant-blue">{Math.min(95, 40 + config.difficulty / 2)}%</span>
                </div>
                <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-valorant-blue"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.min(95, 40 + config.difficulty / 2)}%` }}
                  />
                </div>
              </div>
              <div className="flex justify-between items-center pt-2">
                <span className="text-[10px] font-mono font-black uppercase opacity-30 tracking-widest">Aggression</span>
                <span className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest ${config.difficulty > 50 ? 'bg-valorant-red/10 text-valorant-red' : 'bg-valorant-blue/10 text-valorant-blue'}`}>
                  {config.difficulty > 50 ? 'High' : 'Tactical'}
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
