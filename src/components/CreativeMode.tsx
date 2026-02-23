import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Plus, 
  Settings2, 
  Play, 
  Trash2, 
  Users, 
  Zap, 
  Target, 
  MousePointer2,
  Layers,
  Save,
  ChevronRight,
  Info,
  Map as MapIcon,
  Loader2
} from 'lucide-react';
import { getMaps } from '../services/valorantService';

type EntityType = 'Bot' | 'Smoke' | 'Wall' | 'Marker';

type Entity = {
  id: string;
  type: EntityType;
  x: number;
  y: number;
  config: any;
};

export default function CreativeMode() {
  const [maps, setMaps] = useState<any[]>([]);
  const [selectedMap, setSelectedMap] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [activeTool, setActiveTool] = useState<EntityType | 'Select'>('Select');
  const [showOptions, setShowOptions] = useState(false);
  const [trainingOptions, setTrainingOptions] = useState({
    infiniteAmmo: true,
    infiniteAbilities: true,
    invulnerability: false,
    botDifficulty: 50,
    renderHitboxes: false
  });

  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function loadMaps() {
      try {
        const data = await getMaps();
        const validMaps = data.filter((m: any) => m.displayIcon && m.splash);
        setMaps(validMaps);
        setSelectedMap(validMaps[0]);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMaps();
  }, []);

  const handleCanvasClick = (e: React.MouseEvent) => {
    if (activeTool === 'Select' || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;

    const newEntity: Entity = {
      id: Math.random().toString(36).substr(2, 9),
      type: activeTool as EntityType,
      x,
      y,
      config: {}
    };

    setEntities([...entities, newEntity]);
  };

  const removeEntity = (id: string) => {
    setEntities(entities.filter(e => e.id !== id));
  };

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center gap-6">
        <div className="relative">
          <Loader2 className="w-12 h-12 animate-spin text-valorant-red" />
          <div className="absolute inset-0 blur-xl bg-valorant-red/20 animate-pulse" />
        </div>
        <p className="text-xs font-mono font-black uppercase tracking-[0.4em] opacity-30">Loading Creative Assets...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 h-full max-w-7xl mx-auto">
      {/* Toolbar */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mica-effect p-6 rounded-[2rem] flex items-center justify-between border border-white/5 shadow-2xl"
      >
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-3 px-5 py-2.5 bg-valorant-red/10 rounded-2xl border border-valorant-red/20">
            <Layers className="w-5 h-5 text-valorant-red" />
            <span className="text-xs font-black uppercase tracking-[0.2em]">Creative Engine</span>
          </div>
          <div className="h-8 w-px bg-white/10" />
          <div className="flex gap-2">
            <ToolButton 
              active={activeTool === 'Select'} 
              onClick={() => setActiveTool('Select')} 
              icon={MousePointer2} 
              label="Select" 
            />
            <ToolButton 
              active={activeTool === 'Bot'} 
              onClick={() => setActiveTool('Bot')} 
              icon={Users} 
              label="Place Bot" 
            />
            <ToolButton 
              active={activeTool === 'Smoke'} 
              onClick={() => setActiveTool('Smoke')} 
              icon={Zap} 
              label="Utility" 
            />
            <ToolButton 
              active={activeTool === 'Marker'} 
              onClick={() => setActiveTool('Marker')} 
              icon={Target} 
              label="Marker" 
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => setShowOptions(!showOptions)}
            className="win-button group px-6 py-3 rounded-2xl"
          >
            <Settings2 className={`w-5 h-5 transition-transform duration-500 ${showOptions ? 'rotate-90 text-valorant-red' : ''}`} />
            <span className="font-bold uppercase tracking-widest text-xs">Training Options</span>
          </button>
          <button className="win-button-primary px-8 py-3 rounded-2xl flex items-center gap-3">
            <Play className="w-5 h-5 fill-current" />
            <span className="font-black uppercase tracking-widest text-xs">Test Scenario</span>
          </button>
        </div>
      </motion.div>

      <div className="flex-1 flex gap-8 overflow-hidden">
        {/* Map Canvas */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex-1 mica-effect rounded-[2.5rem] relative overflow-hidden group border border-white/5 shadow-2xl"
        >
          <div 
            ref={containerRef}
            onClick={handleCanvasClick}
            className={`absolute inset-0 cursor-${activeTool === 'Select' ? 'default' : 'crosshair'} transition-all duration-500`}
          >
            {selectedMap?.displayIcon && (
              <img 
                src={selectedMap.displayIcon} 
                className="w-full h-full object-contain opacity-20 p-20 select-none pointer-events-none transition-all duration-1000 group-hover:opacity-30 group-hover:scale-105" 
                alt="Map" 
              />
            )}

            {/* Entities */}
            <AnimatePresence>
              {entities.map(entity => (
                <motion.div
                  key={entity.id}
                  initial={{ scale: 0, opacity: 0, y: 20 }}
                  animate={{ scale: 1, opacity: 1, y: 0 }}
                  exit={{ scale: 0, opacity: 0, y: 20 }}
                  style={{ left: `${entity.x}%`, top: `${entity.y}%` }}
                  className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
                >
                  <div className={`p-4 rounded-2xl border-2 shadow-2xl transition-all duration-300 ${
                    entity.type === 'Bot' ? 'bg-valorant-red border-white/40 shadow-valorant-red/40' :
                    entity.type === 'Smoke' ? 'bg-valorant-blue border-white/40 shadow-valorant-blue/40' :
                    'bg-green-500 border-white/40 shadow-green-500/40'
                  } hover:scale-125 cursor-pointer relative group/entity`}>
                    {entity.type === 'Bot' && <Users className="w-6 h-6 text-white" />}
                    {entity.type === 'Smoke' && <Zap className="w-6 h-6 text-white" />}
                    {entity.type === 'Marker' && <Target className="w-6 h-6 text-white" />}
                    
                    <button 
                      onClick={(e) => { e.stopPropagation(); removeEntity(entity.id); }}
                      className="absolute -top-3 -right-3 w-7 h-7 bg-black border border-white/20 rounded-xl flex items-center justify-center opacity-0 group-hover/entity:opacity-100 transition-all hover:bg-valorant-red hover:border-valorant-red"
                    >
                      <Trash2 className="w-4 h-4 text-white" />
                    </button>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          <div className="absolute bottom-10 left-10 flex items-center gap-6">
            <div className="acrylic-card px-6 py-3 flex items-center gap-4 rounded-2xl border border-white/10">
              <MapIcon className="w-5 h-5 text-valorant-red" />
              <select 
                value={selectedMap?.uuid} 
                onChange={(e) => setSelectedMap(maps.find(m => m.uuid === e.target.value))}
                className="bg-transparent text-xs font-black uppercase tracking-widest focus:outline-none cursor-pointer"
              >
                {maps.map(m => (
                  <option key={m.uuid} value={m.uuid} className="bg-[#0a0a0a]">{m.displayName}</option>
                ))}
              </select>
            </div>
            <div className="text-[10px] font-mono font-black opacity-30 uppercase tracking-[0.3em] bg-black/40 px-4 py-2 rounded-xl border border-white/5">
              Entities: {entities.length} / 50
            </div>
          </div>
        </motion.div>

        {/* Sidebar / Options */}
        <div className="w-96 flex flex-col gap-8">
          <AnimatePresence mode="wait">
            {showOptions ? (
              <motion.div
                key="options"
                initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                className="mica-effect p-10 rounded-[2.5rem] flex-1 space-y-10 border border-white/5 shadow-2xl"
              >
                <div className="flex items-center justify-between border-b border-white/5 pb-6">
                  <h3 className="font-display font-black uppercase tracking-[0.3em] text-sm">Engine Options</h3>
                  <button onClick={() => setShowOptions(false)} className="win-button p-2 rounded-xl hover:text-valorant-red transition-colors">
                    <Plus className="w-5 h-5 rotate-45" />
                  </button>
                </div>

                <div className="space-y-4">
                  <OptionToggle 
                    label="Infinite Ammo" 
                    active={trainingOptions.infiniteAmmo} 
                    onToggle={() => setTrainingOptions(p => ({ ...p, infiniteAmmo: !p.infiniteAmmo }))} 
                  />
                  <OptionToggle 
                    label="Infinite Abilities" 
                    active={trainingOptions.infiniteAbilities} 
                    onToggle={() => setTrainingOptions(p => ({ ...p, infiniteAbilities: !p.infiniteAbilities }))} 
                  />
                  <OptionToggle 
                    label="Invulnerability" 
                    active={trainingOptions.invulnerability} 
                    onToggle={() => setTrainingOptions(p => ({ ...p, invulnerability: !p.invulnerability }))} 
                  />
                  <OptionToggle 
                    label="Render Hitboxes" 
                    active={trainingOptions.renderHitboxes} 
                    onToggle={() => setTrainingOptions(p => ({ ...p, renderHitboxes: !p.renderHitboxes }))} 
                  />
                  
                  <div className="space-y-4 pt-6">
                    <div className="flex justify-between text-[10px] font-mono font-black uppercase opacity-30 tracking-widest">
                      <span>Bot Difficulty</span>
                      <span className="text-valorant-red">{trainingOptions.botDifficulty}%</span>
                    </div>
                    <div className="relative h-2 bg-white/5 rounded-full overflow-hidden">
                      <motion.div 
                        className="absolute h-full bg-valorant-red"
                        animate={{ width: `${trainingOptions.botDifficulty}%` }}
                      />
                      <input 
                        type="range" 
                        min="0" max="100" 
                        value={trainingOptions.botDifficulty}
                        onChange={(e) => setTrainingOptions(p => ({ ...p, botDifficulty: parseInt(e.target.value) }))}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-10">
                  <button className="win-button w-full justify-center gap-3 py-4 rounded-2xl text-valorant-blue border-valorant-blue/20 hover:bg-valorant-blue/5 transition-all">
                    <Save className="w-5 h-5" />
                    <span className="font-black uppercase tracking-widest text-xs">Save Tactical Preset</span>
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="guide"
                initial={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, x: 30, filter: 'blur(10px)' }}
                className="mica-effect p-10 rounded-[2.5rem] flex-1 space-y-10 border border-white/5 shadow-2xl"
              >
                <div className="flex items-center gap-4 mb-2">
                  <div className="w-12 h-12 rounded-2xl bg-valorant-blue/10 flex items-center justify-center">
                    <Info className="w-6 h-6 text-valorant-blue" />
                  </div>
                  <h3 className="font-display font-black uppercase tracking-[0.3em] text-sm">Creative Guide</h3>
                </div>
                <div className="space-y-8 text-sm text-white/40 leading-relaxed">
                  <p>The <span className="text-white font-bold">Creative Engine</span> allows you to build custom tactical scenarios using real map geometry and engine physics.</p>
                  <ul className="space-y-4">
                    <li className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-valorant-red mt-2 shrink-0" />
                      <span>Select a tool from the top bar to place entities.</span>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-valorant-red mt-2 shrink-0" />
                      <span>Click anywhere on the map to deploy tactical units.</span>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-valorant-red mt-2 shrink-0" />
                      <span>Bots will use the AI behavior profile set in options.</span>
                    </li>
                    <li className="flex gap-4">
                      <div className="w-1.5 h-1.5 rounded-full bg-valorant-red mt-2 shrink-0" />
                      <span>Utility markers simulate smoke and wall placements.</span>
                    </li>
                  </ul>
                  <div className="p-8 bg-valorant-red/[0.03] border border-valorant-red/10 rounded-[2rem] mt-10 relative overflow-hidden group">
                    <div className="absolute inset-0 bg-gradient-to-br from-valorant-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    <div className="relative z-10">
                      <p className="text-valorant-red font-black uppercase tracking-[0.2em] mb-2 text-xs">Engine Sync</p>
                      <p className="text-xs font-medium leading-relaxed">Changes here are synchronized with the tactical bridge for real-time training deployment.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

function ToolButton({ active, onClick, icon: Icon, label }: any) {
  return (
    <button
      onClick={onClick}
      className={`win-button px-6 py-3 rounded-2xl flex items-center gap-3 transition-all duration-500 ${
        active 
          ? 'bg-valorant-red/10 border-valorant-red/30 text-valorant-red shadow-[0_0_20px_rgba(255,70,85,0.1)]' 
          : 'text-white/20 hover:text-white/60 hover:bg-white/5'
      }`}
    >
      <Icon className={`w-5 h-5 transition-transform duration-500 ${active ? 'scale-110' : ''}`} />
      <span className="text-[10px] font-black uppercase tracking-widest">{label}</span>
    </button>
  );
}

function OptionToggle({ label, active, onToggle }: any) {
  return (
    <div className="flex items-center justify-between p-6 acrylic-card rounded-2xl border border-white/5 group hover:border-valorant-red/20 transition-all duration-500">
      <span className="text-sm font-bold opacity-60 group-hover:opacity-100 transition-opacity">{label}</span>
      <button 
        onClick={onToggle}
        className={`w-14 h-7 rounded-full transition-all duration-500 relative ${active ? 'bg-valorant-red shadow-[0_0_15px_rgba(255,70,85,0.4)]' : 'bg-white/5'}`}
      >
        <div className={`absolute top-1.5 w-4 h-4 bg-white rounded-full transition-all duration-500 shadow-lg ${active ? 'left-8 scale-110' : 'left-2 scale-100'}`} />
      </button>
    </div>
  );
}
