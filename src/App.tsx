import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  Crosshair, 
  Map as MapIcon, 
  Sword, 
  Bot, 
  Settings,
  Bell,
  User,
  Activity,
  ChevronRight,
  Search,
  Maximize2,
  Minus,
  X,
  Layers,
  Plus,
  Target
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import AimTrainer from './components/AimTrainer';
import AICoach from './components/AICoach';
import MapGuide from './components/MapGuide';
import WeaponGuide from './components/WeaponGuide';
import AgentsView from './components/AgentsView';
import LevelGenerator, { LevelConfig } from './components/LevelGenerator';
import EngineSync from './components/EngineSync';
import TacticalSimulator from './components/TacticalSimulator';
import CreativeMode from './components/CreativeMode';

type Module = 'dashboard' | 'aim' | 'maps' | 'weapons' | 'coach' | 'agents' | 'levels' | 'settings' | 'simulator' | 'creative';

export default function App() {
  const [activeModule, setActiveModule] = useState<Module>('dashboard');
  const [selectedLevel, setSelectedLevel] = useState<LevelConfig | null>(null);

  const navItems = [
    { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
    { id: 'levels', label: 'Tactical Engine', icon: Layers },
    { id: 'creative', label: 'Creative', icon: Plus },
    { id: 'aim', label: 'Reflex Trainer', icon: Crosshair },
    { id: 'agents', label: 'Agent Dossiers', icon: User },
    { id: 'maps', label: 'Map Intel', icon: MapIcon },
    { id: 'weapons', label: 'Arsenal', icon: Sword },
    { id: 'coach', label: 'AI Coach', icon: Bot },
    { id: 'settings', label: 'Engine Sync', icon: Settings },
  ];

  const handleStartLevel = (config: LevelConfig) => {
    setSelectedLevel(config);
    setActiveModule('simulator');
  };

  return (
    <div className="flex h-screen w-full p-4 gap-4 bg-transparent overflow-hidden">
      <div className="flex w-full h-full mica-effect rounded-[2.5rem] overflow-hidden shadow-2xl border border-white/5">
        {/* Sidebar */}
        <aside className="w-80 border-r border-white/5 flex flex-col bg-black/40 backdrop-blur-3xl relative z-30">
          <div className="p-10 flex flex-col gap-10">
            <div className="flex items-center gap-5 group cursor-default">
              <div className="w-14 h-14 bg-valorant-red rounded-2xl flex items-center justify-center shadow-2xl shadow-valorant-red/40 group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <Target className="w-8 h-8 text-white relative z-10" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-black tracking-tighter leading-none text-glow">VALORANT</h1>
                <div className="flex items-center gap-2 mt-1.5">
                  <div className="w-2 h-2 rounded-full bg-valorant-red animate-pulse shadow-[0_0_12px_rgba(255,70,85,1)]" />
                  <span className="text-[10px] font-mono font-black opacity-30 uppercase tracking-[0.4em]">Tactical Hub</span>
                </div>
              </div>
            </div>

            <div className="relative group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 opacity-20 group-focus-within:opacity-100 group-focus-within:text-valorant-red transition-all duration-500" />
              <input 
                type="text" 
                placeholder="Search tactics..." 
                className="w-full bg-white/[0.03] border border-white/5 rounded-2xl py-4 pl-14 pr-4 text-sm font-medium focus:outline-none focus:border-valorant-red/30 focus:bg-white/[0.07] transition-all duration-500 placeholder:opacity-20 shadow-inner"
              />
            </div>
          </div>

          <nav className="flex-1 px-6 space-y-2 overflow-y-auto no-scrollbar">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  setActiveModule(item.id as Module);
                  if (item.id !== 'simulator') setSelectedLevel(null);
                }}
                className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all duration-500 group relative overflow-hidden ${
                  activeModule === item.id 
                    ? 'text-white shadow-2xl' 
                    : 'text-white/20 hover:text-white/60 hover:bg-white/[0.03]'
                }`}
              >
                {activeModule === item.id && (
                  <motion.div 
                    layoutId="nav-active-bg"
                    className="absolute inset-0 bg-white/[0.07] border border-white/10 rounded-2xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                
                <item.icon className={`w-5.5 h-5.5 transition-all duration-500 relative z-10 ${
                  activeModule === item.id ? 'text-valorant-red scale-110 drop-shadow-[0_0_12px_rgba(255,70,85,0.6)]' : 'group-hover:text-valorant-red/60 group-hover:scale-110'
                }`} />
                <span className={`text-sm font-black tracking-tight transition-all duration-500 relative z-10 ${
                  activeModule === item.id ? 'translate-x-1' : 'group-hover:translate-x-1'
                }`}>{item.label}</span>
                
                {activeModule === item.id && (
                  <motion.div 
                    layoutId="nav-glow-line"
                    className="absolute left-0 w-1 h-6 bg-valorant-red rounded-full"
                    initial={false}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>

          <div className="p-10 border-t border-white/5">
            <div className="flex items-center gap-5 p-6 mica-effect rounded-[2rem] group cursor-pointer border border-white/5 hover:border-valorant-red/30 transition-all duration-500 shadow-2xl">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-valorant-red to-valorant-blue p-0.5 group-hover:scale-110 transition-transform duration-700 shadow-xl">
                <div className="w-full h-full rounded-2xl bg-[#0a0a0a] flex items-center justify-center overflow-hidden">
                  <User className="w-7 h-7 opacity-40 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-black truncate tracking-tight group-hover:text-valorant-red transition-colors">AGENT_PLAYER</p>
                <p className="text-[10px] opacity-30 font-mono font-black uppercase tracking-[0.2em] mt-1">Diamond III</p>
              </div>
              <Settings className="w-5 h-5 opacity-20 group-hover:opacity-100 group-hover:rotate-180 transition-all duration-1000" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col relative overflow-hidden bg-black/40">
          {/* Header */}
          <header className="h-24 border-b border-white/5 flex items-center justify-between px-12 bg-black/20 backdrop-blur-3xl z-20">
            <div className="flex flex-col">
              <span className="text-[10px] font-mono font-black opacity-20 uppercase tracking-[0.4em] mb-1.5">Neural Link / Active</span>
              <h2 className="text-2xl font-display font-black tracking-tighter text-glow">
                {navItems.find(n => n.id === activeModule)?.label}
              </h2>
            </div>
            
            <div className="flex items-center gap-10">
              <div className="flex items-center gap-8 text-[10px] font-mono font-black opacity-30">
                <div className="flex items-center gap-2.5">
                  <div className="w-2 h-2 rounded-full bg-green-500 shadow-[0_0_12px_rgba(34,197,94,0.6)] animate-pulse" />
                  <span className="uppercase tracking-[0.2em]">Latency: 14ms</span>
                </div>
                <div className="w-px h-5 bg-white/10" />
                <span className="uppercase tracking-[0.2em]">Region: EU_WEST</span>
              </div>
              
              <div className="flex items-center gap-4">
                <button className="win-button p-3 rounded-2xl hover:text-valorant-red hover:shadow-[0_0_20px_rgba(255,70,85,0.2)] transition-all">
                  <Bell className="w-5 h-5" />
                </button>
                <button className="win-button p-3 rounded-2xl hover:text-valorant-blue hover:shadow-[0_0_20px_rgba(0,181,216,0.2)] transition-all">
                  <Maximize2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </header>

          {/* Content Area */}
          <div className="flex-1 overflow-y-auto p-12 scrollbar-thin">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModule + (selectedLevel?.id || '')}
                initial={{ opacity: 0, y: 30, scale: 0.97, filter: 'blur(10px)' }}
                animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: -30, scale: 0.97, filter: 'blur(10px)' }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="h-full"
              >
                {activeModule === 'dashboard' && <DashboardView onSwitch={setActiveModule} />}
                {activeModule === 'aim' && <AimTrainer config={selectedLevel || undefined} />}
                {activeModule === 'maps' && <MapGuide />}
                {activeModule === 'weapons' && <WeaponGuide />}
                {activeModule === 'levels' && <LevelGenerator onStartLevel={handleStartLevel} />}
                {activeModule === 'coach' && <AICoach />}
                {activeModule === 'agents' && <AgentsView />}
                {activeModule === 'settings' && <EngineSync />}
                {activeModule === 'creative' && <CreativeMode />}
                {activeModule === 'simulator' && selectedLevel && (
                  <TacticalSimulator 
                    config={selectedLevel} 
                    onBack={() => {
                      setActiveModule('levels');
                      setSelectedLevel(null);
                    }} 
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </main>
      </div>
    </div>
  );
}

function DashboardView({ onSwitch }: { onSwitch: (m: Module) => void }) {
  return (
    <div className="space-y-16 max-w-7xl mx-auto">
      <div className="flex flex-col gap-4">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs font-mono font-black text-valorant-red uppercase tracking-[0.5em] mb-2 block">Tactical Overview</span>
          <h2 className="text-6xl font-display font-black tracking-tighter leading-tight">Welcome back, <span className="text-valorant-red text-glow-red">Agent</span>.</h2>
          <p className="text-white/30 text-lg mt-4 max-w-2xl leading-relaxed">Your tactical performance is up <span className="text-green-400 font-bold">12%</span> this week. The engine is synchronized and ready for deployment.</p>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <StatCard label="Training Hours" value="124.5" trend="+12%" icon={Activity} delay={0.3} />
        <StatCard label="Avg. Accuracy" value="68%" trend="+5%" icon={Crosshair} color="text-valorant-blue" delay={0.4} />
        <StatCard label="Tactical Score" value="842" trend="+24" icon={Bot} color="text-valorant-red" delay={0.5} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center justify-between px-2">
            <h3 className="text-2xl font-display font-black tracking-tight">Recommended Drills</h3>
            <button onClick={() => onSwitch('levels')} className="win-button-primary">View All Tactics</button>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <DrillItem 
              title="Creative Sandbox" 
              desc="Build and test custom tactical scenarios with real engine data" 
              difficulty="Creative"
              onClick={() => onSwitch('creative')}
              delay={0.6}
            />
            <DrillItem 
              title="Micro-Flick Mastery" 
              desc="Improve precision on small targets with dynamic movement" 
              difficulty="Hard"
              onClick={() => onSwitch('levels')}
              delay={0.7}
            />
            <DrillItem 
              title="Haven A-Site Retake" 
              desc="Learn optimal utility usage and positioning for site control" 
              difficulty="Medium"
              onClick={() => onSwitch('maps')}
              delay={0.8}
            />
          </div>
        </div>

        <div className="space-y-8">
          <h3 className="text-2xl font-display font-black tracking-tight px-2">Engine Status</h3>
          <div className="space-y-6">
            <div className="p-8 bg-white/[0.02] border border-white/5 rounded-[2rem] relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-br from-valorant-red/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="relative z-10">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-[10px] font-mono font-black uppercase opacity-30 tracking-widest">Neural Link</span>
                  <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <span className="text-[10px] font-mono font-black text-green-400 tracking-widest">STABLE</span>
                  </div>
                </div>
                <div className="w-full h-2 bg-white/5 rounded-full overflow-hidden mb-4">
                  <motion.div 
                    initial={{ width: 0 }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                    className="h-full bg-valorant-red shadow-[0_0_10px_rgba(255,70,85,0.5)]"
                  />
                </div>
                <p className="text-[10px] font-mono font-bold opacity-20 uppercase tracking-widest text-center">Synchronization Complete</p>
              </div>
            </div>
            
            <IntelItem 
              title="Direct Engine Access" 
              desc="Deep integration with local files active" 
              tag="System"
              delay={0.9}
            />
            <IntelItem 
              title="Creative Mode Active" 
              desc="Custom entities enabled in sandbox" 
              tag="Engine"
              delay={1.0}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ label, value, trend, icon: Icon, color = "text-white", delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="acrylic-card p-10 flex items-center justify-between rounded-[2.5rem] group"
    >
      <div>
        <p className="text-[10px] font-mono font-black uppercase opacity-30 mb-2 tracking-[0.3em]">{label}</p>
        <h4 className={`text-5xl font-display font-black tracking-tighter ${color} group-hover:scale-105 transition-transform duration-500 origin-left`}>{value}</h4>
        <div className="flex items-center gap-2 mt-3">
          <div className="w-1 h-1 rounded-full bg-green-400" />
          <p className="text-[10px] font-mono font-black text-green-400 tracking-widest uppercase">{trend} this week</p>
        </div>
      </div>
      <div className={`p-6 rounded-2xl bg-white/5 ${color} group-hover:bg-white/10 transition-colors duration-500`}>
        <Icon className="w-8 h-8" />
      </div>
    </motion.div>
  );
}

function DrillItem({ title, desc, difficulty, onClick, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay }}
      onClick={onClick}
      className="flex items-center justify-between p-8 acrylic-card rounded-[2rem] hover:bg-white/5 transition-all cursor-pointer group relative overflow-hidden"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-valorant-red/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      <div className="relative z-10 flex items-center gap-8">
        <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center group-hover:bg-valorant-red/10 group-hover:text-valorant-red transition-all duration-500">
          <Activity className="w-6 h-6" />
        </div>
        <div>
          <h5 className="text-lg font-black tracking-tight group-hover:text-valorant-red transition-colors duration-300">{title}</h5>
          <p className="text-sm opacity-30 font-medium mt-1">{desc}</p>
        </div>
      </div>
      <div className="relative z-10 flex items-center gap-6">
        <span className={`text-[10px] font-mono font-black uppercase px-4 py-2 rounded-xl bg-black/40 border border-white/5 ${
          difficulty === 'Hard' ? 'text-valorant-red border-valorant-red/20' : 
          difficulty === 'Medium' ? 'text-valorant-blue border-valorant-blue/20' : 
          difficulty === 'Creative' ? 'text-purple-400 border-purple-400/20' :
          'text-green-400 border-green-400/20'
        }`}>
          {difficulty}
        </span>
        <ChevronRight className="w-5 h-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-500 text-valorant-red" />
      </div>
    </motion.div>
  );
}

function IntelItem({ title, desc, tag, delay = 0 }: any) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="p-8 border-l-4 border-valorant-red bg-white/[0.02] rounded-r-[2rem] group hover:bg-white/[0.04] transition-all duration-500"
    >
      <div className="flex items-center justify-between mb-2">
        <h5 className="text-sm font-black tracking-tight group-hover:text-valorant-red transition-colors">{title}</h5>
        <span className="text-[9px] font-mono font-black uppercase opacity-20 tracking-widest">{tag}</span>
      </div>
      <p className="text-xs opacity-30 font-medium leading-relaxed">{desc}</p>
    </motion.div>
  );
}
