import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ArrowRight, ArrowLeft, RotateCcw, Sparkles } from 'lucide-react';

const LEVELS = [
  { id: 0, name: 'Universe', emoji: '🌌' },
  { id: 1, name: 'Galaxy Cluster', emoji: '✨' },
  { id: 2, name: 'Milky Way', emoji: '🌠' },
  { id: 3, name: 'Solar System', emoji: '☀️' },
  { id: 4, name: 'Earth', emoji: '🌍' },
  { id: 5, name: 'Atoms', emoji: '⚛️' },
  { id: 6, name: 'Quarks', emoji: '🔬' },
];

const TEAM_EMOJIS = ['🌌', '⚛️', '🪐', '🔬', '🌟', '💫', '🚀', '🛸', '☄️', '🌙'];

interface Team {
  id: number;
  name: string;
  emoji: string;
  position: number;
}

type GamePhase = 'setup' | 'playing';

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('setup');
  const [teamCount, setTeamCount] = useState<number>(2);
  const [teamNames, setTeamNames] = useState<string[]>(['Team 1', 'Team 2']);
  const [teams, setTeams] = useState<Team[]>([]);
  const [winner, setWinner] = useState<Team | null>(null);
  const [miniGameDialogOpen, setMiniGameDialogOpen] = useState(false);
  const [selectedTeamForMiniGame, setSelectedTeamForMiniGame] = useState<string>('');

  const handleTeamCountChange = (count: number) => {
    setTeamCount(count);
    const newNames = Array.from({ length: count }, (_, i) => 
      teamNames[i] || `Team ${i + 1}`
    );
    setTeamNames(newNames);
  };

  const handleTeamNameChange = (index: number, name: string) => {
    const newNames = [...teamNames];
    newNames[index] = name;
    setTeamNames(newNames);
  };

  const startGame = () => {
    const newTeams: Team[] = teamNames.map((name, index) => ({
      id: index,
      name: name || `Team ${index + 1}`,
      emoji: TEAM_EMOJIS[index % TEAM_EMOJIS.length],
      position: 0,
    }));
    setTeams(newTeams);
    setPhase('playing');
    setWinner(null);
  };

  const moveTeam = (teamId: number, direction: 'forward' | 'backward') => {
    if (winner) return;

    setTeams(prevTeams => 
      prevTeams.map(team => {
        if (team.id !== teamId) return team;
        
        const newPosition = direction === 'forward' 
          ? Math.min(team.position + 1, LEVELS.length - 1)
          : Math.max(team.position - 1, 0);
        
        const updatedTeam = { ...team, position: newPosition };
        
        if (newPosition === LEVELS.length - 1 && !winner) {
          setTimeout(() => setWinner(updatedTeam), 300);
        }
        
        return updatedTeam;
      })
    );
  };

  const resetGame = () => {
    setTeams(prevTeams => 
      prevTeams.map(team => ({ ...team, position: 0 }))
    );
    setWinner(null);
  };

  const handleMiniGameResult = (result: 'win' | 'lose') => {
    if (winner) return;
    
    const teamId = parseInt(selectedTeamForMiniGame);
    if (result === 'lose') {
      moveTeam(teamId, 'backward');
    }
    setMiniGameDialogOpen(false);
    setSelectedTeamForMiniGame('');
  };

  const getTeamsAtLevel = (levelId: number) => {
    return teams.filter(team => team.position === levelId);
  };

  if (phase === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl backdrop-blur-sm bg-card/90 border-2 border-primary/20">
          <CardHeader className="text-center space-y-4">
            <div className="flex justify-center">
              <img 
                src="/assets/generated/macro-micro-badge.dim_512x512.png" 
                alt="Macro → Micro" 
                className="h-24 w-24 object-contain"
              />
            </div>
            <CardTitle className="text-4xl font-bold tracking-tight">
              Macro → Micro
            </CardTitle>
            <p className="text-muted-foreground text-lg">
              Physics Event Board Game Setup
            </p>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-3">
              <Label htmlFor="team-count" className="text-lg">
                Number of Teams (2-10)
              </Label>
              <Input
                id="team-count"
                type="number"
                min={2}
                max={10}
                value={teamCount}
                onChange={(e) => handleTeamCountChange(Math.max(2, Math.min(10, parseInt(e.target.value) || 2)))}
                className="text-lg h-12"
              />
            </div>

            <div className="space-y-4">
              <Label className="text-lg">Team Names</Label>
              <div className="grid gap-3">
                {teamNames.map((name, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <span className="text-2xl">{TEAM_EMOJIS[index % TEAM_EMOJIS.length]}</span>
                    <Input
                      value={name}
                      onChange={(e) => handleTeamNameChange(index, e.target.value)}
                      placeholder={`Team ${index + 1}`}
                      className="text-lg h-12"
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button 
              onClick={startGame} 
              size="lg" 
              className="w-full text-xl h-14 font-semibold"
            >
              Start Game
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      {/* Header */}
      <header className="border-b border-border/50 backdrop-blur-sm bg-background/80 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img 
              src="/assets/generated/macro-micro-badge.dim_512x512.png" 
              alt="Macro → Micro" 
              className="h-12 w-12 object-contain"
            />
            <h1 className="text-3xl font-bold tracking-tight">Macro → Micro</h1>
          </div>
          <div className="flex gap-3">
            <Button
              onClick={() => setMiniGameDialogOpen(true)}
              disabled={!!winner}
              variant="outline"
              size="lg"
              className="text-lg h-12"
            >
              <Sparkles className="mr-2 h-5 w-5" />
              Mini Game Result
            </Button>
            <Button
              onClick={resetGame}
              variant="outline"
              size="lg"
              className="text-lg h-12"
            >
              <RotateCcw className="mr-2 h-5 w-5" />
              Reset Game
            </Button>
          </div>
        </div>
      </header>

      {/* Winner Banner */}
      {winner && (
        <div className="bg-gradient-to-r from-chart-1 via-chart-2 to-chart-3 text-primary-foreground py-8 text-center animate-in fade-in slide-in-from-top duration-500">
          <div className="text-6xl font-bold">
            🏆 Winner: {winner.name}
          </div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-[1fr_300px] gap-8">
          {/* Board Area */}
          <div className="space-y-8">
            {/* Horizontal Board (Desktop) */}
            <div className="hidden lg:block">
              <div className="flex items-center justify-between gap-2">
                {LEVELS.map((level, index) => {
                  const teamsHere = getTeamsAtLevel(level.id);
                  const isOccupied = teamsHere.length > 0;
                  
                  return (
                    <div key={level.id} className="flex items-center flex-1">
                      <div className={`
                        relative flex-1 rounded-2xl border-4 p-6 transition-all duration-300
                        ${isOccupied 
                          ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20 scale-105' 
                          : 'border-border/50 bg-card/50'
                        }
                      `}>
                        <div className="text-center space-y-3">
                          <div className="text-5xl">{level.emoji}</div>
                          <div className="font-bold text-xl">{level.name}</div>
                          
                          {/* Pawns */}
                          {teamsHere.length > 0 && (
                            <div className="flex flex-wrap gap-2 justify-center mt-4 min-h-[3rem]">
                              {teamsHere.map(team => (
                                <div
                                  key={team.id}
                                  className="flex items-center gap-1 bg-accent text-accent-foreground px-3 py-1.5 rounded-full text-sm font-semibold animate-in zoom-in duration-300"
                                  style={{ animationDelay: `${team.id * 50}ms` }}
                                >
                                  <span className="text-lg">{team.emoji}</span>
                                  <span>{team.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {index < LEVELS.length - 1 && (
                        <div className="flex-shrink-0 px-2">
                          <ArrowRight className="h-8 w-8 text-muted-foreground" />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Vertical Board (Mobile) */}
            <div className="lg:hidden space-y-4">
              {LEVELS.map((level, index) => {
                const teamsHere = getTeamsAtLevel(level.id);
                const isOccupied = teamsHere.length > 0;
                
                return (
                  <div key={level.id} className="space-y-2">
                    <div className={`
                      rounded-2xl border-4 p-6 transition-all duration-300
                      ${isOccupied 
                        ? 'border-primary bg-primary/10 shadow-lg shadow-primary/20' 
                        : 'border-border/50 bg-card/50'
                      }
                    `}>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl">{level.emoji}</div>
                        <div className="flex-1">
                          <div className="font-bold text-lg">{level.name}</div>
                          {teamsHere.length > 0 && (
                            <div className="flex flex-wrap gap-2 mt-2">
                              {teamsHere.map(team => (
                                <div
                                  key={team.id}
                                  className="flex items-center gap-1 bg-accent text-accent-foreground px-2 py-1 rounded-full text-sm font-semibold"
                                >
                                  <span>{team.emoji}</span>
                                  <span>{team.name}</span>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {index < LEVELS.length - 1 && (
                      <div className="flex justify-center">
                        <ArrowRight className="h-6 w-6 text-muted-foreground rotate-90" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Team Controls */}
            <div className="grid sm:grid-cols-2 gap-4 mt-8">
              {teams.map(team => (
                <Card key={team.id} className="backdrop-blur-sm bg-card/90">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-xl">
                      <span className="text-2xl">{team.emoji}</span>
                      <span>{team.name}</span>
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">
                      Current: <span className="font-semibold text-foreground">{LEVELS[team.position].name}</span>
                    </p>
                  </CardHeader>
                  <CardContent className="flex gap-2">
                    <Button
                      onClick={() => moveTeam(team.id, 'backward')}
                      disabled={team.position === 0 || !!winner}
                      variant="outline"
                      size="lg"
                      className="flex-1 text-base h-12"
                    >
                      <ArrowLeft className="mr-2 h-5 w-5" />
                      Backward
                    </Button>
                    <Button
                      onClick={() => moveTeam(team.id, 'forward')}
                      disabled={team.position === LEVELS.length - 1 || !!winner}
                      size="lg"
                      className="flex-1 text-base h-12"
                    >
                      Forward
                      <ArrowRight className="ml-2 h-5 w-5" />
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-24 h-fit">
            <Card className="backdrop-blur-sm bg-card/90">
              <CardHeader>
                <CardTitle className="text-2xl">Team Positions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {teams.map(team => (
                  <div
                    key={team.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-accent/50 border border-border/50"
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{team.emoji}</span>
                      <span className="font-semibold">{team.name}</span>
                    </div>
                    <div className="text-sm font-medium text-muted-foreground">
                      {LEVELS[team.position].name}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </aside>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-border/50 backdrop-blur-sm bg-background/80 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026. Built with ❤️ using{' '}
          <a 
            href="https://caffeine.ai" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-foreground hover:text-primary transition-colors font-semibold"
          >
            caffeine.ai
          </a>
        </div>
      </footer>

      {/* Mini Game Dialog */}
      <Dialog open={miniGameDialogOpen} onOpenChange={setMiniGameDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl">Mini Game Result</DialogTitle>
            <DialogDescription className="text-base">
              Select a team and the result of their mini game.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="team-select" className="text-base">Select Team</Label>
              <Select value={selectedTeamForMiniGame} onValueChange={setSelectedTeamForMiniGame}>
                <SelectTrigger id="team-select" className="h-12 text-base">
                  <SelectValue placeholder="Choose a team..." />
                </SelectTrigger>
                <SelectContent>
                  {teams.map(team => (
                    <SelectItem key={team.id} value={team.id.toString()} className="text-base">
                      <span className="flex items-center gap-2">
                        <span>{team.emoji}</span>
                        <span>{team.name}</span>
                      </span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              onClick={() => handleMiniGameResult('win')}
              disabled={!selectedTeamForMiniGame}
              variant="outline"
              size="lg"
              className="flex-1 text-base h-12"
            >
              Win (No Change)
            </Button>
            <Button
              onClick={() => handleMiniGameResult('lose')}
              disabled={!selectedTeamForMiniGame}
              size="lg"
              className="flex-1 text-base h-12"
            >
              Lose (Move Back)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
