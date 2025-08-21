import React from 'react';
import { Link } from 'react-router-dom';
import { Sword, Shield, Users, Eye, Scroll, Dice6 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DndButton } from '@/components/ui/dnd-button';
import { Badge } from '@/components/ui/badge';
import { getCharacters, getCampaign } from '@/lib/data';

const Index = () => {
  const characters = getCharacters();
  const campaign = getCampaign();

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-parchment border-b border-accent/30 shadow-mystical">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-6">
              <Sword className="w-12 h-12 text-primary animate-glow-pulse" />
              <h1 className="text-6xl font-title font-bold text-primary">
                D&D Campaign Manager
              </h1>
              <Shield className="w-12 h-12 text-accent animate-glow-pulse" />
            </div>
            
            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              A comprehensive digital companion for Dungeon Masters and players. 
              Manage characters, track encounters, roll dice, and bring your campaigns to life.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <DndButton variant="hero" size="xl" asChild>
                <Link to="/dm">
                  <Sword className="w-5 h-5" />
                  DM Dashboard
                </Link>
              </DndButton>
              
              <DndButton variant="mystical" size="xl" asChild>
                <Link to="/screen">
                  <Eye className="w-5 h-5" />
                  Player Screen
                </Link>
              </DndButton>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Campaign Overview */}
          <Card className="lg:col-span-2 bg-parchment border-accent/30 shadow-parchment">
            <CardHeader>
              <CardTitle className="font-title text-2xl text-primary flex items-center gap-2">
                <Scroll className="w-6 h-6" />
                Current Campaign
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h3 className="text-xl font-title font-semibold text-primary mb-2">
                    {campaign.name}
                  </h3>
                  <p className="text-muted-foreground leading-relaxed">
                    {campaign.description}
                  </p>
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center p-3 bg-card/50 rounded border border-border/50">
                    <div className="text-2xl font-title font-bold text-primary">
                      {campaign.characters.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Active Players</div>
                  </div>
                  
                  <div className="text-center p-3 bg-card/50 rounded border border-border/50">
                    <div className="text-2xl font-title font-bold text-primary">
                      {campaign.sessions.length}
                    </div>
                    <div className="text-sm text-muted-foreground">Sessions</div>
                  </div>
                  
                  <div className="text-center p-3 bg-card/50 rounded border border-border/50">
                    <div className="text-2xl font-title font-bold text-accent">
                      0
                    </div>
                    <div className="text-sm text-muted-foreground">Encounters</div>
                  </div>
                  
                  <div className="text-center p-3 bg-card/50 rounded border border-border/50">
                    <div className="text-2xl font-title font-bold text-accent">
                      0
                    </div>
                    <div className="text-sm text-muted-foreground">Monsters</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="bg-parchment border-accent/30 shadow-parchment">
            <CardHeader>
              <CardTitle className="font-title text-xl text-primary">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <DndButton variant="hero" className="w-full" asChild>
                <Link to="/dm">
                  <Sword className="w-4 h-4" />
                  Open DM Dashboard
                </Link>
              </DndButton>
              
              <DndButton variant="mystical" className="w-full" asChild>
                <Link to="/screen">
                  <Eye className="w-4 h-4" />
                  Player Screen
                </Link>
              </DndButton>
              
              <DndButton variant="outline" className="w-full">
                <Dice6 className="w-4 h-4" />
                Quick Dice Roll
              </DndButton>
            </CardContent>
          </Card>
        </div>

        {/* Character Gallery */}
        <div className="mt-12">
          <h2 className="text-3xl font-title font-bold text-primary mb-6 text-center">
            Active Characters
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {characters.map(character => (
              <Card 
                key={character.id} 
                className="bg-parchment border-accent/30 shadow-parchment hover:shadow-mystical transition-all duration-300 group"
              >
                <CardHeader>
                  <CardTitle className="font-title text-xl text-primary group-hover:text-primary-glow transition-colors">
                    {character.name}
                  </CardTitle>
                  <div className="text-muted-foreground">
                    Level {character.level} {character.race} {character.class}
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span>Armor Class:</span>
                      <Badge variant="outline">{character.armorClass}</Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Hit Points:</span>
                      <Badge 
                        variant={character.hitPoints.current < character.hitPoints.maximum / 2 ? "destructive" : "outline"}
                      >
                        {character.hitPoints.current}/{character.hitPoints.maximum}
                      </Badge>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span>Speed:</span>
                      <Badge variant="secondary">{character.speed} ft</Badge>
                    </div>
                    
                    <DndButton variant="mystical" size="sm" className="w-full mt-4" asChild>
                      <Link to={`/${character.id}`}>
                        <Users className="w-4 h-4" />
                        View Character Sheet
                      </Link>
                    </DndButton>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {/* Add Character Card */}
            <Card className="bg-parchment border-accent/30 shadow-parchment border-2 border-dashed hover:border-solid hover:shadow-mystical transition-all duration-300 cursor-pointer">
              <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                <Users className="w-12 h-12 text-muted-foreground mb-4" />
                <h3 className="font-title text-lg text-primary mb-2">Add New Character</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Create a character sheet for a new player
                </p>
                <DndButton variant="outline" size="sm">
                  <Users className="w-4 h-4" />
                  Create Character
                </DndButton>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* Footer */}
        <footer className="mt-16 py-8 text-center border-t border-accent/30">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sword className="w-5 h-5 text-primary" />
            <span className="font-title font-semibold text-primary">D&D Campaign Manager</span>
            <Shield className="w-5 h-5 text-accent" />
          </div>
          <p className="text-muted-foreground text-sm">
            Crafted for epic adventures • Built with React, TypeScript & Tailwind CSS
          </p>
        </footer>
      </div>
    </div>
  );
};

export default Index;
