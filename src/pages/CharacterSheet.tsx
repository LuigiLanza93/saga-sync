import React from 'react';
import { useParams, Navigate } from 'react-router-dom';
import { Heart, Shield, Zap, Sword, Eye, BookOpen } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { getCharacter, getAbilityModifier, formatModifier, type Character } from '@/lib/data';

export default function CharacterSheet() {
  const { character: characterId } = useParams<{ character: string }>();
  
  if (!characterId) {
    return <Navigate to="/" replace />;
  }
  
  const character = getCharacter(characterId);
  
  if (!character) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="bg-parchment border-accent/30 shadow-parchment">
          <CardContent className="p-8 text-center">
            <h2 className="text-2xl font-title font-bold text-primary mb-4">Character Not Found</h2>
            <p className="text-muted-foreground mb-4">
              The character "{characterId}" doesn't exist.
            </p>
            <a 
              href="/" 
              className="text-primary hover:text-primary/80 underline font-semibold"
            >
              Return to Home
            </a>
          </CardContent>
        </Card>
      </div>
    );
  }

  const hpPercentage = (character.hitPoints.current / character.hitPoints.maximum) * 100;
  
  return (
    <div className="min-h-screen bg-background">
      {/* Character Header */}
      <header className="border-b border-accent/30 bg-gradient-parchment shadow-parchment">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-title font-bold text-primary">
                {character.name}
              </h1>
              <p className="text-lg text-muted-foreground">
                Level {character.level} {character.race} {character.class}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Armor Class</div>
                <div className="text-2xl font-title font-bold text-primary">
                  {character.armorClass}
                </div>
              </div>
              <div className="text-center">
                <div className="text-sm text-muted-foreground">Speed</div>
                <div className="text-2xl font-title font-bold text-primary">
                  {character.speed} ft
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Core Stats */}
          <div className="space-y-6">
            {/* Hit Points */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2">
                  <Heart className="w-5 h-5" />
                  Hit Points
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-2xl font-title font-bold">
                      {character.hitPoints.current}
                    </span>
                    <span className="text-muted-foreground">
                      / {character.hitPoints.maximum}
                    </span>
                  </div>
                  <Progress 
                    value={hpPercentage} 
                    className="h-3"
                  />
                  {character.hitPoints.temporary > 0 && (
                    <div className="text-sm">
                      <Badge variant="secondary">
                        +{character.hitPoints.temporary} temp HP
                      </Badge>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Ability Scores */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary">Ability Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  {Object.entries(character.abilities).map(([ability, score]) => {
                    const modifier = getAbilityModifier(score);
                    return (
                      <div key={ability} className="text-center p-3 bg-card/50 rounded border border-border/50">
                        <div className="text-xs font-title uppercase text-muted-foreground">
                          {ability.slice(0, 3)}
                        </div>
                        <div className="text-lg font-bold">{score}</div>
                        <div className="text-sm text-muted-foreground">
                          {formatModifier(modifier)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Proficiency Bonus */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardContent className="p-4">
                <div className="flex justify-between items-center">
                  <span className="font-title text-primary">Proficiency Bonus</span>
                  <Badge variant="outline" className="text-lg px-3 py-1">
                    +{character.proficiencyBonus}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Middle Column - Skills & Saves */}
          <div className="space-y-6">
            {/* Saving Throws */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2">
                  <Shield className="w-5 h-5" />
                  Saving Throws
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Object.entries(character.savingThrows).map(([save, bonus]) => (
                    <div key={save} className="flex justify-between items-center">
                      <span className="capitalize text-sm">{save}</span>
                      <Badge variant="outline">{formatModifier(bonus)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Skills */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2">
                  <Zap className="w-5 h-5" />
                  Skills
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {Object.entries(character.skills).map(([skill, bonus]) => (
                    <div key={skill} className="flex justify-between items-center">
                      <span className="text-sm">
                        {skill.replace(/([A-Z])/g, ' $1').trim()}
                      </span>
                      <Badge variant="outline">{formatModifier(bonus)}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Combat Stats */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2">
                  <Sword className="w-5 h-5" />
                  Combat
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Armor Class</span>
                    <Badge variant="outline">{character.armorClass}</Badge>
                  </div>
                  <div className="flex justify-between">
                    <span>Speed</span>
                    <Badge variant="outline">{character.speed} ft</Badge>
                  </div>
                  <div className="text-sm text-muted-foreground mt-3">
                    {character.notes}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Equipment & Background */}
          <div className="space-y-6">
            {/* Equipment */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary">Equipment</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-1">
                  {character.equipment.map((item, index) => (
                    <div 
                      key={index} 
                      className="text-sm p-2 bg-card/30 rounded border border-border/30"
                    >
                      {item}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Character Background */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary flex items-center gap-2">
                  <BookOpen className="w-5 h-5" />
                  Background
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm text-foreground">
                  <p className="text-sm leading-relaxed">
                    {character.backstory}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card className="bg-parchment border-accent/30 shadow-parchment">
              <CardHeader>
                <CardTitle className="font-title text-primary">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <button className="w-full p-2 text-left text-sm hover:bg-accent/10 rounded border border-border/30 transition-colors">
                  Roll Initiative (1d20{formatModifier(getAbilityModifier(character.abilities.dexterity))})
                </button>
                <button className="w-full p-2 text-left text-sm hover:bg-accent/10 rounded border border-border/30 transition-colors">
                  Short Rest
                </button>
                <button className="w-full p-2 text-left text-sm hover:bg-accent/10 rounded border border-border/30 transition-colors">
                  Long Rest
                </button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}