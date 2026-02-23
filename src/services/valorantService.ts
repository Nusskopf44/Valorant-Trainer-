export async function getAgents() {
  const res = await fetch('https://valorant-api.com/v1/agents?isPlayableCharacter=true');
  const data = await res.json();
  return data.data;
}

export async function getWeapons() {
  const res = await fetch('https://valorant-api.com/v1/weapons');
  const data = await res.json();
  return data.data;
}

export async function getMaps() {
  const res = await fetch('https://valorant-api.com/v1/maps');
  const data = await res.json();
  return data.data;
}

export async function getTiers() {
  const res = await fetch('https://valorant-api.com/v1/competitivetiers');
  const data = await res.json();
  return data.data;
}
