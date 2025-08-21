// D&D Dice System - Complete parser and roller

export type DiceRoll = {
  count: number;
  sides: number;
  modifier: number;
  advantage?: boolean;
  disadvantage?: boolean;
};

export type RollResult = {
  rolls: number[];
  total: number;
  modifier: number;
  formula: string;
  breakdown: string;
};

// Parse dice notation (e.g., "2d6+3", "1d20", "d4-1", "2d20kh1+5" for advantage)
export function parseDiceString(input: string): DiceRoll | null {
  // Clean input
  const cleanInput = input.toLowerCase().replace(/\s/g, '');
  
  // Enhanced regex for D&D dice notation
  const diceRegex = /^(?:(\d+)?d(\d+)(?:(kh|kl)(\d+))?(?:([+-])(\d+))?)|(?:([+-]?\d+))$/;
  const match = cleanInput.match(diceRegex);
  
  if (!match) return null;
  
  // If it's just a number (like "+3" or "5")
  if (match[7]) {
    return {
      count: 0,
      sides: 0,
      modifier: parseInt(match[7]),
    };
  }
  
  const count = match[1] ? parseInt(match[1]) : 1;
  const sides = parseInt(match[2]);
  const keepType = match[3]; // kh (keep highest) or kl (keep lowest)
  const keepCount = match[4] ? parseInt(match[4]) : null;
  const modifierSign = match[5];
  const modifierValue = match[6] ? parseInt(match[6]) : 0;
  
  let modifier = 0;
  if (modifierSign && modifierValue) {
    modifier = modifierSign === '+' ? modifierValue : -modifierValue;
  }
  
  // Handle advantage/disadvantage (common D&D mechanic)
  const advantage = keepType === 'kh' && count > 1;
  const disadvantage = keepType === 'kl' && count > 1;
  
  return {
    count,
    sides,
    modifier,
    advantage,
    disadvantage,
  };
}

// Roll dice and return detailed results
export function rollDice(diceRoll: DiceRoll): RollResult {
  const { count, sides, modifier } = diceRoll;
  
  if (count === 0) {
    // Just a modifier
    return {
      rolls: [],
      total: modifier,
      modifier,
      formula: modifier.toString(),
      breakdown: modifier.toString(),
    };
  }
  
  const rolls: number[] = [];
  
  // Roll the dice
  for (let i = 0; i < count; i++) {
    rolls.push(Math.floor(Math.random() * sides) + 1);
  }
  
  // Handle advantage/disadvantage
  let finalRolls = [...rolls];
  let advantageNote = '';
  
  if (diceRoll.advantage && rolls.length >= 2) {
    const highest = Math.max(...rolls);
    finalRolls = [highest];
    advantageNote = ' (Advantage)';
  } else if (diceRoll.disadvantage && rolls.length >= 2) {
    const lowest = Math.min(...rolls);
    finalRolls = [lowest];
    advantageNote = ' (Disadvantage)';
  }
  
  const rollSum = finalRolls.reduce((sum, roll) => sum + roll, 0);
  const total = rollSum + modifier;
  
  // Create formula string
  const formula = count > 0 
    ? `${count}d${sides}${modifier !== 0 ? (modifier > 0 ? `+${modifier}` : modifier) : ''}`
    : modifier.toString();
  
  // Create breakdown string
  let breakdown = '';
  if (rolls.length > 0) {
    if (diceRoll.advantage || diceRoll.disadvantage) {
      breakdown = `[${rolls.join(', ')}]→${finalRolls[0]}${advantageNote}`;
    } else {
      breakdown = `[${rolls.join(', ')}]`;
    }
    if (modifier !== 0) {
      breakdown += ` ${modifier > 0 ? '+' : ''}${modifier}`;
    }
    breakdown += ` = ${total}`;
  } else {
    breakdown = total.toString();
  }
  
  return {
    rolls: finalRolls,
    total,
    modifier,
    formula,
    breakdown,
  };
}

// Quick roll function for common D&D dice
export function quickRoll(notation: string): RollResult | null {
  const parsed = parseDiceString(notation);
  if (!parsed) return null;
  return rollDice(parsed);
}

// Common D&D rolls
export const commonRolls = {
  d4: () => quickRoll('1d4'),
  d6: () => quickRoll('1d6'),
  d8: () => quickRoll('1d8'),
  d10: () => quickRoll('1d10'),
  d12: () => quickRoll('1d12'),
  d20: () => quickRoll('1d20'),
  d100: () => quickRoll('1d100'),
  advantage: () => quickRoll('2d20kh1'), // Roll with advantage
  disadvantage: () => quickRoll('2d20kl1'), // Roll with disadvantage
};

// Ability score rolls
export const abilityRolls = {
  standard: () => quickRoll('4d6kh3'), // Drop lowest of 4d6
  heroic: () => quickRoll('4d6kh3'), // Same but you can reroll 1s in practice
  pointBuy: () => null, // Not a roll
};

// Common damage rolls by weapon type
export const weaponDamage = {
  dagger: () => quickRoll('1d4'),
  shortsword: () => quickRoll('1d6'),
  longsword: () => quickRoll('1d8'),
  greatsword: () => quickRoll('2d6'),
  greataxe: () => quickRoll('1d12'),
  // Add more as needed
};