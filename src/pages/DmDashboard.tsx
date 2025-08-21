import React, { useState } from 'react';
import { Sword, Shield, Users, Scroll, Dice6, Eye, Plus, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DndButton } from '@/components/ui/dnd-button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DiceRoller } from '@/components/DiceRoller';
import { quickRoll, commonRolls, type RollResult } from '@/lib/dice';
import { getCharacters, getMonsters, getCampaign, getEncounters, type Character, type Monster } from '@/lib/data';

export default function DmDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  const [rollLog, setRollLog] = useState<RollResult[]>([]);
  
  const characters = getCharacters();
  const monsters = getMonsters();
  const campaign = getCampaign();
  const encounters = getEncounters();

  const handleRoll = (result: RollResult) => {
    setRollLog(prev => [result, ...prev.slice(0, 9)]); // Keep last 10 rolls
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-accent/30 bg-gradient-parchment shadow-parchment">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-title font-bold text-primary">
                Dungeon Master Dashboard
              </h1>
              <p className="text-muted-foreground mt-1">
                Campaign: {campaign.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <DndButton variant="mystical" size="sm">
                <Eye className="w-4 h-4" />
                Player View
              </DndButton>
              <DndButton variant="hero" size="sm">
                <Plus className="w-4 h-4" />
                New Encounter
              </DndButton>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-5 bg-parchment border border-accent/30">
            <TabsTrigger value="overview" className="font-title">
              <Shield className="w-4 h-4 mr-2" />
              Overview
            </TabsTrigger>
            <TabsTrigger value="encounters" className="font-title">
              <Sword className="w-4 h-4 mr-2" />
              Encounters
            </TabsTrigger>
            <TabsTrigger value="bestiary" className="font-title">
              <Users className="w-4 h-4 mr-2" />
              Bestiary
            </TabsTrigger>
            <TabsTrigger value="story" className="font-title">
              <Scroll className="w-4 h-4 mr-2" />
              Story
            </TabsTrigger>
            <TabsTrigger value="dice" className="font-title">
              <Dice6 className="w-4 h-4 mr-2" />
              Dice & Tools
            </TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Campaign Status */}
              <Card className="bg-parchment border-accent/30 shadow-parchment">
                <CardHeader>
                  <CardTitle className="font-title text-primary flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Campaign Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Active Players:</span>
                      <Badge variant="outline">{campaign.characters.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Sessions:</span>
                      <Badge variant="outline">{campaign.sessions.length}</Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Encounters:</span>
                      <Badge variant="outline">{encounters.length}</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Active Characters */}
              <Card className="bg-parchment border-accent/30 shadow-parchment">
                <CardHeader>
                  <CardTitle className="font-title text-primary flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Active Characters
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {characters.map(character => (
                      <div key={character.id} className="flex items-center justify-between p-2 bg-card/50 rounded border border-border/50">
                        <div>
                          <div className="font-semibold text-sm">{character.name}</div>
                          <div className="text-xs text-muted-foreground">
                            Level {character.level} {character.race} {character.class}
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-xs">HP</div>
                          <Badge variant={character.hitPoints.current < character.hitPoints.maximum / 2 ? "destructive" : "outline"}>
                            {character.hitPoints.current}/{character.hitPoints.maximum}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card className="bg-parchment border-accent/30 shadow-parchment">
                <CardHeader>
                  <CardTitle className="font-title text-primary">Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <DndButton variant="hero" className="w-full">
                    <Plus className="w-4 h-4" />
                    Start Encounter
                  </DndButton>
                  <DndButton variant="mystical" className="w-full">
                    <Scroll className="w-4 h-4" />
                    Add Story Note
                  </DndButton>
                  <DndButton variant="outline" className="w-full">
                    <Eye className="w-4 h-4" />
                    Player Screen
                  </DndButton>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Encounters Tab */}
          <TabsContent value="encounters" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-title font-semibold text-primary">Encounter Management</h3>
              <DndButton variant="hero">
                <Plus className="w-4 h-4" />
                Create Encounter
              </DndButton>
            </div>
            
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardContent className="p-6">
                <p className="text-center text-muted-foreground py-8">
                  No encounters created yet. Start by creating your first encounter to track combat and initiative.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Bestiary Tab */}
          <TabsContent value="bestiary" className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-title font-semibold text-primary">Monster Bestiary</h3>
              <div className="flex gap-2">
                <Input placeholder="Search monsters..." className="w-64" />
                <DndButton variant="outline">
                  <Search className="w-4 h-4" />
                </DndButton>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {monsters.map(monster => (
                <Card key={monster.id} className="bg-parchment border-accent/30 shadow-parchment hover:shadow-mystical transition-shadow">
                  <CardHeader className="pb-2">
                    <CardTitle className="font-title text-lg text-primary">{monster.name}</CardTitle>
                    <div className="text-sm text-muted-foreground">
                      {monster.size} {monster.type}, {monster.alignment}
                    </div>
                  </CardHeader>
                  <CardContent className="pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>AC:</span>
                        <Badge variant="outline">{monster.armorClass}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>HP:</span>
                        <Badge variant="outline">{monster.hitPoints}</Badge>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span>CR:</span>
                        <Badge variant="secondary">{monster.challengeRating}</Badge>
                      </div>
                    </div>
                    <DndButton variant="mystical" size="sm" className="w-full mt-4">
                      Add to Encounter
                    </DndButton>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Story Tab */}
          <TabsContent value="story" className="space-y-6">
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary">Campaign Notes</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-card p-4 rounded-lg border border-border min-h-[300px] text-foreground">
                  {campaign.notes || "No campaign notes yet. Start writing your story here..."}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dice & Tools Tab */}
          <TabsContent value="dice" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Dice Roller */}
              <div className="lg:col-span-2">
                <DiceRoller onRoll={handleRoll} />
              </div>

              {/* Roll Log */}
              <Card className="bg-parchment border-accent/30 shadow-parchment">
                <CardHeader>
                  <CardTitle className="font-title text-primary">Roll Log</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {rollLog.length === 0 ? (
                      <p className="text-muted-foreground text-center py-4">
                        No rolls yet. Start rolling dice!
                      </p>
                    ) : (
                      rollLog.map((roll, index) => (
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
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}