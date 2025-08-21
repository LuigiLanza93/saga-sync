import React, { useState } from 'react';
import { Dice1, Dice2, Dice3, Dice4, Dice5, Dice6 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { DndButton } from '@/components/ui/dnd-button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { quickRoll, commonRolls, type RollResult } from '@/lib/dice';

interface DiceRollerProps {
  onRoll?: (result: RollResult) => void;
}

export function DiceRoller({ onRoll }: DiceRollerProps) {
  const [customRoll, setCustomRoll] = useState('1d20');
  const [lastResult, setLastResult] = useState<RollResult | null>(null);
  const [rollHistory, setRollHistory] = useState<RollResult[]>([]);

  const handleRoll = (notation: string) => {
    const result = quickRoll(notation);
    if (result) {
      setLastResult(result);
      setRollHistory(prev => [result, ...prev.slice(0, 4)]); // Keep last 5 rolls
      onRoll?.(result);
    }
  };

  const handleCustomRoll = () => {
    handleRoll(customRoll);
  };

  const quickDiceButtons = [
    { label: 'd4', notation: '1d4', icon: Dice1 },
    { label: 'd6', notation: '1d6', icon: Dice2 },
    { label: 'd8', notation: '1d8', icon: Dice3 },
    { label: 'd10', notation: '1d10', icon: Dice4 },
    { label: 'd12', notation: '1d12', icon: Dice5 },
    { label: 'd20', notation: '1d20', icon: Dice6 },
  ];

  const specialRolls = [
    { label: 'Advantage', notation: '2d20kh1' },
    { label: 'Disadvantage', notation: '2d20kl1' },
    { label: 'Ability Score', notation: '4d6kh3' },
  ];

  return (
    <Card className="bg-parchment border-accent/30 shadow-parchment">
      <CardHeader>
        <CardTitle className="font-title text-primary">Dice Roller</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Last Result Display */}
        {lastResult && (
          <div className="text-center p-4 bg-gradient-gold rounded-lg border border-accent/30">
            <div className="text-3xl font-title font-bold text-foreground mb-2">
              {lastResult.total}
            </div>
            <div className="text-sm text-muted-foreground">
              {lastResult.breakdown}
            </div>
          </div>
        )}

        {/* Quick Dice */}
        <div>
          <h4 className="font-title text-sm font-semibold mb-2 text-primary">Quick Dice</h4>
          <div className="grid grid-cols-3 gap-2">
            {quickDiceButtons.map(({ label, notation, icon: Icon }) => (
              <DndButton
                key={label}
                variant="outline"
                size="sm"
                onClick={() => handleRoll(notation)}
                className="flex items-center gap-1"
              >
                <Icon size={16} />
                {label}
              </DndButton>
            ))}
          </div>
        </div>

        {/* Special Rolls */}
        <div>
          <h4 className="font-title text-sm font-semibold mb-2 text-primary">Special Rolls</h4>
          <div className="grid grid-cols-1 gap-2">
            {specialRolls.map(({ label, notation }) => (
              <DndButton
                key={label}
                variant="mystical"
                size="sm"
                onClick={() => handleRoll(notation)}
                className="text-xs"
              >
                {label}
              </DndButton>
            ))}
          </div>
        </div>

        {/* Custom Roll */}
        <div>
          <h4 className="font-title text-sm font-semibold mb-2 text-primary">Custom Roll</h4>
          <div className="flex gap-2">
            <Input
              value={customRoll}
              onChange={(e) => setCustomRoll(e.target.value)}
              placeholder="e.g., 2d6+3, 1d20+5"
              className="bg-card border-border"
            />
            <DndButton 
              onClick={handleCustomRoll}
              variant="hero"
              size="sm"
            >
              Roll
            </DndButton>
          </div>
        </div>

        {/* Roll History */}
        {rollHistory.length > 0 && (
          <div>
            <h4 className="font-title text-sm font-semibold mb-2 text-primary">Recent Rolls</h4>
            <div className="space-y-1 max-h-24 overflow-y-auto">
              {rollHistory.map((roll, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center text-xs bg-card/50 p-2 rounded border border-border/50"
                >
                  <span className="font-mono">{roll.formula}</span>
                  <Badge variant="outline" className="ml-2">
                    {roll.total}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}