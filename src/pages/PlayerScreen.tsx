import React, { useState } from 'react';
import { Eye, Users, Scroll, Dice6, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DiceRoller } from '@/components/DiceRoller';
import { getCharacters, getCampaign } from '@/lib/data';
import { type RollResult } from '@/lib/dice';

export default function PlayerScreen() {
  const [publicRolls, setPublicRolls] = useState<RollResult[]>([]);
  
  const characters = getCharacters();
  const campaign = getCampaign();

  const handleRoll = (result: RollResult) => {
    setPublicRolls(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 rolls
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-accent/30 bg-gradient-parchment shadow-parchment">
        <div className="container mx-auto px-4 py-6">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Eye className="w-8 h-8 text-primary" />
              <h1 className="text-4xl font-title font-bold text-primary">
                Player Screen
              </h1>
            </div>
            <p className="text-xl text-muted-foreground">
              {campaign.name}
            </p>
            <div className="mt-4 flex justify-center">
              <Badge variant="outline" className="text-lg px-4 py-2">
                {characters.length} Active Players
              </Badge>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* Main Content Area */}
          <div className="xl:col-span-2 space-y-8">
            
            {/* Party Overview */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2 text-2xl">
                  <Users className="w-6 h-6" />
                  The Adventuring Party
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {characters.map(character => (
                    <div 
                      key={character.id} 
                      className="p-4 bg-gradient-gold rounded-lg border-2 border-accent/30 shadow-mystical"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h3 className="text-lg font-title font-semibold text-foreground">
                          {character.name}
                        </h3>
                        <Badge variant="secondary">
                          Level {character.level}
                        </Badge>
                      </div>
                      
                      <div className="text-sm text-foreground/80 mb-3">
                        {character.race} {character.class}
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex justify-between">
                          <span>AC:</span>
                          <Badge variant="outline">{character.armorClass}</Badge>
                        </div>
                        <div className="flex justify-between">
                          <span>HP:</span>
                          <Badge 
                            variant={character.hitPoints.current < character.hitPoints.maximum / 2 ? "destructive" : "outline"}
                          >
                            {character.hitPoints.current}/{character.hitPoints.maximum}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Campaign Information */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2 text-2xl">
                  <Scroll className="w-6 h-6" />
                  Current Story
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-lg text-foreground max-w-none">
                  <p className="leading-relaxed text-lg">
                    {campaign.description}
                  </p>
                  
                  {campaign.notes && (
                    <div className="mt-6 p-4 bg-card/50 rounded-lg border border-border/50">
                      <h4 className="font-title font-semibold text-primary mb-2">Recent Events:</h4>
                      <p className="text-base leading-relaxed">
                        {campaign.notes}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Session History */}
            {campaign.sessions.length > 0 && (
              <Card className="bg-parchment border-accent/30 shadow-parchment">
                <CardHeader>
                  <CardTitle className="font-title text-primary text-xl">
                    Session History
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {campaign.sessions.slice(0, 3).map(session => (
                      <div 
                        key={session.id} 
                        className="p-3 bg-card/30 rounded border border-border/30"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-semibold">{session.title}</h4>
                          <Badge variant="outline">
                            {new Date(session.date).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {session.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Right Sidebar */}
          <div className="space-y-6">
            
            {/* Dice Roller */}
            <DiceRoller onRoll={handleRoll} />

            {/* Public Roll Log */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2">
                  <Dice6 className="w-5 h-5" />
                  Public Rolls
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {publicRolls.length === 0 ? (
                    <p className="text-muted-foreground text-center py-4 text-sm">
                      No public rolls yet. Roll some dice!
                    </p>
                  ) : (
                    publicRolls.map((roll, index) => (
                      <div
                        key={index}
                        className="flex justify-between items-center text-sm bg-card/50 p-2 rounded border border-border/50"
                      >
                        <div>
                          <div className="font-mono font-semibold">{roll.formula}</div>
                          <div className="text-xs text-muted-foreground">{roll.breakdown}</div>
                        </div>
                        <Badge variant="outline" className="ml-2 font-bold">
                          {roll.total}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-2">
                <div className="p-2 bg-card/30 rounded">
                  <strong>Initiative:</strong> 1d20 + Dex modifier
                </div>
                <div className="p-2 bg-card/30 rounded">
                  <strong>Death Saves:</strong> 1d20 (10+ succeeds)
                </div>
                <div className="p-2 bg-card/30 rounded">
                  <strong>Ability Check:</strong> 1d20 + ability + proficiency
                </div>
                <div className="p-2 bg-card/30 rounded">
                  <strong>Attack Roll:</strong> 1d20 + ability + prof
                </div>
              </CardContent>
            </Card>

            {/* DM Communication */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2">
                  <MessageCircle className="w-5 h-5" />
                  DM Notes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center text-muted-foreground py-4 text-sm">
                  Waiting for DM updates...
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}