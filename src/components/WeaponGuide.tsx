import React, { useState, useEffect } from 'react';
import { Sword, BarChart3, TrendingUp, Target, Loader2 } from 'lucide-react';
import { getWeapons } from '../services/valorantService';

export default function WeaponGuide() {
  const [weapons, setWeapons] = useState<any[]>([]);
  const [selectedWeapon, setSelectedWeapon] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await getWeapons();
        setWeapons(data);
        setSelectedWeapon(data.find((w: any) => w.displayName === 'Vandal') || data[0]);
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

  const stats = selectedWeapon?.weaponStats;
  const damageRanges = stats?.damageRanges?.[0];

  return (
    <div className="flex flex-col gap-6 p-6 glass-panel tactical-border">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Sword className="w-6 h-6 text-valorant-gray" />
          <h2 className="text-2xl">Arsenal Database</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-1 space-y-1 max-h-[600px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10">
          <h3 className="text-[10px] opacity-50 mb-4 font-mono uppercase">Inventory</h3>
          {weapons.map(w => (
            <button
              key={w.uuid}
              onClick={() => setSelectedWeapon(w)}
              className={`w-full text-left px-4 py-2 text-sm transition-all flex items-center justify-between group ${
                selectedWeapon?.uuid === w.uuid
                  ? 'bg-valorant-red text-white'
                  : 'bg-white/5 hover:bg-white/10 text-valorant-gray/60'
              }`}
            >
              <div className="flex items-center gap-3">
                {w.displayIcon && <img src={w.displayIcon} className="w-8 h-4 object-contain opacity-60 group-hover:opacity-100" alt="" />}
                <span>{w.displayName}</span>
              </div>
              <span className={`text-[10px] font-mono ${selectedWeapon?.uuid === w.uuid ? 'text-white/80' : 'text-valorant-red'}`}>
                ¤{w.shopData?.cost || 0}
              </span>
            </button>
          ))}
        </div>

        <div className="lg:col-span-3 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="flex items-center gap-6">
              {selectedWeapon?.displayIcon && (
                <img src={selectedWeapon.displayIcon} className="w-32 h-16 object-contain" alt={selectedWeapon.displayName} />
              )}
              <div>
                <h4 className="text-3xl font-display mb-1">{selectedWeapon?.displayName}</h4>
                <p className="text-xs font-mono uppercase text-valorant-red tracking-widest">
                  {selectedWeapon?.category?.split('::')[1] || 'Unknown'}
                </p>
              </div>
            </div>

            {stats && (
              <>
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-3 bg-white/5 border border-white/5 rounded">
                    <div className="text-[10px] opacity-40 uppercase font-mono mb-1">Head</div>
                    <div className="text-xl font-bold text-valorant-red">{Math.round(damageRanges?.headDamage || 0)}</div>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded">
                    <div className="text-[10px] opacity-40 uppercase font-mono mb-1">Body</div>
                    <div className="text-xl font-bold">{Math.round(damageRanges?.bodyDamage || 0)}</div>
                  </div>
                  <div className="p-3 bg-white/5 border border-white/5 rounded">
                    <div className="text-[10px] opacity-40 uppercase font-mono mb-1">Legs</div>
                    <div className="text-xl font-bold opacity-60">{Math.round(damageRanges?.legDamage || 0)}</div>
                  </div>
                </div>

                <div className="space-y-4">
                   <StatBar label="Fire Rate" value={stats.fireRate} max={16} />
                   <StatBar label="Magazine" value={stats.magazineSize} max={100} />
                   <StatBar label="Reload Speed" value={stats.reloadTimeSeconds} max={5} inverse />
                </div>
              </>
            )}
          </div>

          <div className="bg-black/40 rounded-lg border border-white/5 p-6 flex flex-col justify-between">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <Target className="w-4 h-4 text-valorant-red" />
                <h5 className="text-sm font-mono uppercase">Tactical Specs</h5>
              </div>
              <div className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <span className="opacity-40">Wall Penetration</span>
                  <span className="text-valorant-blue">{stats?.wallPenetration?.split('::')[1] || 'None'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-40">Run Speed Multiplier</span>
                  <span>{stats?.runSpeedMultiplier || 1}x</span>
                </div>
                <div className="flex justify-between">
                  <span className="opacity-40">Equip Time</span>
                  <span>{stats?.equipTimeSeconds || 0}s</span>
                </div>
              </div>
            </div>
            
            <div className="mt-4 p-3 bg-valorant-blue/10 border border-valorant-blue/20 rounded text-[11px] leading-relaxed">
              <TrendingUp className="w-3 h-3 mb-1 text-valorant-blue" />
              <span className="text-valorant-gray/80">
                {selectedWeapon?.displayName === 'Vandal' 
                  ? "High recoil but one-tap potential at any range. Pull down and slightly left after the 3rd shot."
                  : selectedWeapon?.displayName === 'Phantom'
                  ? "Easier recoil control and suppressed fire. Better for spraying through smokes."
                  : "Standard weapon performance. Focus on controlled bursts and movement accuracy."}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatBar({ label, value, max, inverse = false }: { label: string, value: number, max: number, inverse?: boolean }) {
  const percentage = inverse 
    ? Math.min(100, ((max - value) / max) * 100)
    : Math.min(100, (value / max) * 100);
    
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-[10px] uppercase font-mono">
        <span className="opacity-50">{label}</span>
        <span>{value}</span>
      </div>
      <div className="h-1 bg-white/5 rounded-full overflow-hidden">
        <div 
          className="h-full bg-valorant-gray/40 transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}

