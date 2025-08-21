// Data management for D&D Campaign Manager
// Using localStorage for persistence (replaces file system in Lovable)

export interface Character {
  id: string;
  name: string;
  race: string;
  class: string;
  level: number;
  hitPoints: {
    current: number;
    maximum: number;
    temporary: number;
  };
  armorClass: number;
  speed: number;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  savingThrows: Record<string, number>;
  skills: Record<string, number>;
  proficiencyBonus: number;
  equipment: string[];
  spells?: Spell[];
  notes: string;
  backstory: string;
}

export interface Monster {
  id: string;
  name: string;
  size: string;
  type: string;
  alignment: string;
  armorClass: number;
  hitPoints: number;
  speed: string;
  abilities: {
    strength: number;
    dexterity: number;
    constitution: number;
    intelligence: number;
    wisdom: number;
    charisma: number;
  };
  damage_resistances?: string;
  damage_immunities?: string;
  condition_immunities?: string;
  senses: string;
  languages: string;
  challengeRating: string;
  actions: Action[];
  legendary_actions?: Action[];
  reactions?: Action[];
}

export interface Action {
  name: string;
  description: string;
  damage?: string;
  attack_bonus?: number;
}

export interface Spell {
  name: string;
  level: number;
  school: string;
  castingTime: string;
  range: string;
  components: string;
  duration: string;
  description: string;
}

export interface Encounter {
  id: string;
  name: string;
  description: string;
  monsters: {
    monsterId: string;
    count: number;
    initiative?: number;
  }[];
  difficulty: 'easy' | 'medium' | 'hard' | 'deadly';
  experience: number;
}

export interface Campaign {
  id: string;
  name: string;
  description: string;
  characters: string[]; // character IDs
  currentEncounter?: string;
  sessions: Session[];
  notes: string;
}

export interface Session {
  id: string;
  date: string;
  title: string;
  summary: string;
  experience: number;
}

// Default data
const defaultCharacters: Character[] = [
  {
    id: 'gigi',
    name: 'Gigi Lightfinger',
    race: 'Halfling',
    class: 'Rogue',
    level: 3,
    hitPoints: { current: 24, maximum: 24, temporary: 0 },
    armorClass: 15,
    speed: 25,
    abilities: {
      strength: 8,
      dexterity: 17,
      constitution: 14,
      intelligence: 12,
      wisdom: 13,
      charisma: 16
    },
    savingThrows: {
      dexterity: 5,
      intelligence: 3
    },
    skills: {
      stealth: 7,
      sleightOfHand: 7,
      perception: 3,
      deception: 5,
      persuasion: 5
    },
    proficiencyBonus: 2,
    equipment: [
      'Leather Armor',
      'Shortsword',
      'Shortbow',
      'Thieves\' Tools',
      'Burglar\'s Pack'
    ],
    notes: 'Sneak Attack: +2d6 damage',
    backstory: 'A nimble halfling thief from the streets of Waterdeep.'
  }
];

const defaultMonsters: Monster[] = [
  {
    id: 'goblin',
    name: 'Goblin',
    size: 'Small',
    type: 'humanoid',
    alignment: 'neutral evil',
    armorClass: 15,
    hitPoints: 7,
    speed: '30 ft.',
    abilities: {
      strength: 8,
      dexterity: 14,
      constitution: 10,
      intelligence: 10,
      wisdom: 8,
      charisma: 8
    },
    senses: 'darkvision 60 ft.',
    languages: 'Common, Goblin',
    challengeRating: '1/4',
    actions: [
      {
        name: 'Scimitar',
        description: 'Melee Weapon Attack: +4 to hit, reach 5 ft., one target.',
        damage: '1d6+2 slashing',
        attack_bonus: 4
      },
      {
        name: 'Shortbow',
        description: 'Ranged Weapon Attack: +4 to hit, range 80/320 ft., one target.',
        damage: '1d6+2 piercing',
        attack_bonus: 4
      }
    ]
  }
];

const defaultCampaign: Campaign = {
  id: 'main-campaign',
  name: 'The Lost Mines of Phandelver',
  description: 'A classic D&D adventure for new players.',
  characters: ['gigi'],
  sessions: [],
  notes: 'Campaign started on the road to Phandalin...'
};

// Storage functions
export function saveToStorage<T>(key: string, data: T): void {
  localStorage.setItem(key, JSON.stringify(data));
}

export function loadFromStorage<T>(key: string, defaultValue: T): T {
  try {
    const stored = localStorage.getItem(key);
    return stored ? JSON.parse(stored) : defaultValue;
  } catch {
    return defaultValue;
  }
}

// Data access functions
export function getCharacters(): Character[] {
  return loadFromStorage('dnd-characters', defaultCharacters);
}

export function getCharacter(id: string): Character | null {
  const characters = getCharacters();
  return characters.find(c => c.id === id) || null;
}

export function saveCharacter(character: Character): void {
  const characters = getCharacters();
  const index = characters.findIndex(c => c.id === character.id);
  
  if (index >= 0) {
    characters[index] = character;
  } else {
    characters.push(character);
  }
  
  saveToStorage('dnd-characters', characters);
}

export function getMonsters(): Monster[] {
  return loadFromStorage('dnd-monsters', defaultMonsters);
}

export function getMonster(id: string): Monster | null {
  const monsters = getMonsters();
  return monsters.find(m => m.id === id) || null;
}

export function saveMonster(monster: Monster): void {
  const monsters = getMonsters();
  const index = monsters.findIndex(m => m.id === monster.id);
  
  if (index >= 0) {
    monsters[index] = monster;
  } else {
    monsters.push(monster);
  }
  
  saveToStorage('dnd-monsters', monsters);
}

export function getCampaign(): Campaign {
  return loadFromStorage('dnd-campaign', defaultCampaign);
}

export function saveCampaign(campaign: Campaign): void {
  saveToStorage('dnd-campaign', campaign);
}

export function getEncounters(): Encounter[] {
  return loadFromStorage('dnd-encounters', []);
}

export function saveEncounter(encounter: Encounter): void {
  const encounters = getEncounters();
  const index = encounters.findIndex(e => e.id === encounter.id);
  
  if (index >= 0) {
    encounters[index] = encounter;
  } else {
    encounters.push(encounter);
  }
  
  saveToStorage('dnd-encounters', encounters);
}

// Utility functions
export function getAbilityModifier(score: number): number {
  return Math.floor((score - 10) / 2);
}

export function formatModifier(modifier: number): string {
  return modifier >= 0 ? `+${modifier}` : modifier.toString();
}

export function calculateProficiencyBonus(level: number): number {
  return Math.ceil(level / 4) + 1;
}