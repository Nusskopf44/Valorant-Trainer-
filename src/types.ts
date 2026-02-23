export type Agent = {
  id: string;
  name: string;
  role: 'Duelist' | 'Initiator' | 'Controller' | 'Sentinel';
  abilities: Ability[];
  description: string;
};

export type Ability = {
  name: string;
  description: string;
  type: 'Basic' | 'Signature' | 'Ultimate';
};

export type Weapon = {
  name: string;
  type: 'Sidearm' | 'SMG' | 'Shotgun' | 'Rifle' | 'Sniper' | 'Machine Gun';
  cost: number;
  damage: {
    head: number;
    body: number;
    leg: number;
  };
  fireRate: number;
  magazineSize: number;
};

export type TrainingSession = {
  id: string;
  date: string;
  score: number;
  accuracy: number;
  targetsHit: number;
  totalTargets: number;
};
