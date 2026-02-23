import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Target, Play, RotateCcw, Crosshair, Settings2, X, Trophy, Timer, MousePointer2 } from 'lucide-react';
import confetti from 'canvas-confetti';
import { LevelConfig } from './LevelGenerator';

type TargetObj = {
  id: number;
  x: number;
  y: number;
  radius: number;
  createdAt: number;
  vx: number;
  vy: number;
};

export default function AimTrainer({ config, onComplete }: { config?: LevelConfig, onComplete?: (score: number) => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [score, setScore] = useState(0);
  const [hits, setHits] = useState(0);
  const [misses, setMisses] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [targets, setTargets] = useState<TargetObj[]>([]);
  const requestRef = useRef<number>(undefined);
  const lastTargetTime = useRef<number>(0);

  const [options, setOptions] = useState(config?.options || {
    targetSize: 20,
    spawnRate: 800,
    lifespan: 2000,
    duration: 30,
    movingTargets: false,
    targetSpeed: 0
  });

  useEffect(() => {
    if (config) {
      setOptions(config.options);
      setTimeLeft(config.options.duration);
    }
  }, [config]);

  const spawnTarget = (width: number, height: number) => {
    const radius = options.targetSize;
    const x = Math.random() * (width - radius * 2) + radius;
    const y = Math.random() * (height - radius * 2) + radius;
    
    let vx = 0;
    let vy = 0;
    if (options.movingTargets && options.targetSpeed) {
      const angle = Math.random() * Math.PI * 2;
      vx = Math.cos(angle) * options.targetSpeed;
      vy = Math.sin(angle) * options.targetSpeed;
    }

    return {
      id: Date.now() + Math.random(),
      x,
      y,
      radius,
      createdAt: Date.now(),
      vx,
      vy
    };
  };

  const startGame = () => {
    setIsPlaying(true);
    setShowSettings(false);
    setScore(0);
    setHits(0);
    setMisses(0);
    setTimeLeft(options.duration);
    setTargets([]);
    lastTargetTime.current = Date.now();
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isPlaying) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    let hit = false;
    setTargets(prev => {
      const filtered = prev.filter(t => {
        const dist = Math.sqrt((x - t.x) ** 2 + (y - t.y) ** 2);
        if (dist <= t.radius) {
          hit = true;
          return false;
        }
        return true;
      });
      return filtered;
    });

    if (hit) {
      setHits(h => h + 1);
      setScore(s => s + 100);
    } else {
      setMisses(m => m + 1);
      setScore(s => Math.max(0, s - 25));
    }
  };

  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsPlaying(false);
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#ff4655', '#ece8e1', '#00b5d8']
          });
          if (onComplete) onComplete(score);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying, score, onComplete]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const animate = (time: number) => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      if (isPlaying) {
        // Spawn new targets
        if (Date.now() - lastTargetTime.current > options.spawnRate) {
          setTargets(prev => [...prev, spawnTarget(canvas.width, canvas.height)]);
          lastTargetTime.current = Date.now();
        }

        // Update target positions and remove expired
        setTargets(prev => {
          return prev
            .filter(t => Date.now() - t.createdAt < options.lifespan)
            .map(t => {
              let nextX = t.x + t.vx;
              let nextY = t.y + t.vy;
              let nextVx = t.vx;
              let nextVy = t.vy;

              // Bounce off walls
              if (nextX - t.radius < 0 || nextX + t.radius > canvas.width) nextVx *= -1;
              if (nextY - t.radius < 0 || nextY + t.radius > canvas.height) nextVy *= -1;

              return { ...t, x: nextX, y: nextY, vx: nextVx, vy: nextVy };
            });
        });
      }

      // Draw targets
      targets.forEach(t => {
        const age = (Date.now() - t.createdAt) / options.lifespan;
        const scale = 1 - age;
        
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * scale, 0, Math.PI * 2);
        ctx.fillStyle = '#ff4655';
        ctx.fill();
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Inner circle
        ctx.beginPath();
        ctx.arc(t.x, t.y, t.radius * scale * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = 'white';
        ctx.fill();
      });

      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [isPlaying, targets, options]);

  const accuracy = hits + misses === 0 ? 0 : Math.round((hits / (hits + misses)) * 100);

  return (
    <div className="flex flex-col gap-6 p-8 mica-effect rounded-xl shadow-2xl">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-valorant-red/10 rounded-lg">
            <Crosshair className="w-8 h-8 text-valorant-red" />
          </div>
          <div>
            <h2 className="text-2xl font-display">{config?.name || "Reflex Trainer"}</h2>
            <p className="text-xs opacity-40 font-mono uppercase tracking-widest">{config?.category || "Custom Session"}</p>
          </div>
        </div>
        
        <div className="flex items-center gap-8">
          <div className="flex gap-12">
            <StatItem icon={Trophy} label="Score" value={score} color="text-valorant-red" />
            <StatItem icon={MousePointer2} label="Accuracy" value={`${accuracy}%`} />
            <StatItem icon={Timer} label="Time" value={`${timeLeft}s`} />
          </div>
          <button 
            onClick={() => setShowSettings(!showSettings)}
            className="win-button p-3"
          >
            <Settings2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="relative aspect-video bg-black/60 rounded-xl overflow-hidden cursor-crosshair border border-white/5 shadow-inner">
        <canvas
          ref={canvasRef}
          width={1200}
          height={675}
          onClick={handleCanvasClick}
          className="w-full h-full"
        />
        
        <AnimatePresence>
          {!isPlaying && !showSettings && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-md"
            >
              <div className="text-center max-w-sm">
                {timeLeft === 0 ? (
                  <motion.div 
                    initial={{ scale: 0.9 }}
                    animate={{ scale: 1 }}
                    className="space-y-6"
                  >
                    <h3 className="text-5xl font-display">Session End</h3>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="acrylic-card p-4">
                        <p className="text-[10px] opacity-40 uppercase mb-1">Final Score</p>
                        <p className="text-3xl font-bold text-valorant-red">{score}</p>
                      </div>
                      <div className="acrylic-card p-4">
                        <p className="text-[10px] opacity-40 uppercase mb-1">Accuracy</p>
                        <p className="text-3xl font-bold">{accuracy}%</p>
                      </div>
                    </div>
                    <button 
                      onClick={startGame}
                      className="win-button-primary w-full py-4 text-lg"
                    >
                      <RotateCcw className="w-5 h-5" /> Restart Drill
                    </button>
                  </motion.div>
                ) : (
                  <div className="space-y-8">
                    <div className="space-y-2">
                       <h3 className="text-4xl font-display">Ready, Agent?</h3>
                       <p className="text-white/40 text-sm">Focus on the targets. Precision is key to victory.</p>
                    </div>
                    <button 
                      onClick={startGame}
                      className="win-button-primary px-16 py-5 text-2xl group"
                    >
                      <Play className="w-8 h-8 fill-current group-hover:scale-110 transition-transform" /> 
                      <span>Deploy</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {showSettings && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="absolute inset-0 flex items-center justify-center bg-black/80 backdrop-blur-xl p-8"
            >
              <div className="w-full max-w-md space-y-8">
                <div className="flex items-center justify-between border-b border-white/10 pb-6">
                  <h3 className="text-2xl font-display">Tactical Config</h3>
                  <button onClick={() => setShowSettings(false)} className="win-button p-2"><X className="w-6 h-6" /></button>
                </div>

                <div className="space-y-6">
                  <SettingSlider 
                    label="Target Size" 
                    value={options.targetSize} 
                    min={5} max={50} 
                    onChange={(v: number) => setOptions(prev => ({ ...prev, targetSize: v }))} 
                  />
                  <SettingSlider 
                    label="Spawn Rate (ms)" 
                    value={options.spawnRate} 
                    min={100} max={2000} step={50}
                    onChange={(v: number) => setOptions(prev => ({ ...prev, spawnRate: v }))} 
                  />
                  <SettingSlider 
                    label="Target Lifespan (ms)" 
                    value={options.lifespan} 
                    min={300} max={5000} step={100}
                    onChange={(v: number) => setOptions(prev => ({ ...prev, lifespan: v }))} 
                  />
                  <div className="flex items-center justify-between acrylic-card p-4">
                    <span className="text-sm font-mono uppercase opacity-60">Moving Targets</span>
                    <button 
                      onClick={() => setOptions(prev => ({ ...prev, movingTargets: !prev.movingTargets }))}
                      className={`w-12 h-6 rounded-full transition-colors relative ${options.movingTargets ? 'bg-valorant-red' : 'bg-white/10'}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-all ${options.movingTargets ? 'left-7' : 'left-1'}`} />
                    </button>
                  </div>
                  {options.movingTargets && (
                    <SettingSlider 
                      label="Target Speed" 
                      value={options.targetSpeed || 0} 
                      min={1} max={10} step={0.5}
                      onChange={(v: number) => setOptions(prev => ({ ...prev, targetSpeed: v }))} 
                    />
                  )}
                </div>

                <button 
                  onClick={startGame}
                  className="win-button-primary w-full py-4 text-xl"
                >
                  Apply & Deploy
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function StatItem({ icon: Icon, label, value, color = "text-white" }: any) {
  return (
    <div className="flex flex-col items-center">
      <div className="flex items-center gap-2 mb-1">
        <Icon className="w-3 h-3 opacity-40" />
        <span className="text-[10px] font-mono uppercase opacity-40">{label}</span>
      </div>
      <span className={`text-2xl font-display ${color}`}>{value}</span>
    </div>
  );
}

function SettingSlider({ label, value, min, max, step = 1, onChange }: any) {
  return (
    <div className="space-y-3">
      <div className="flex justify-between text-xs font-mono uppercase">
        <span className="opacity-50">{label}</span>
        <span className="text-valorant-red">{value}</span>
      </div>
      <input 
        type="range" 
        min={min} 
        max={max} 
        step={step}
        value={value} 
        onChange={(e) => onChange(parseFloat(e.target.value))}
        className="w-full h-1 bg-white/10 rounded-lg appearance-none cursor-pointer accent-valorant-red"
      />
    </div>
  );
}
