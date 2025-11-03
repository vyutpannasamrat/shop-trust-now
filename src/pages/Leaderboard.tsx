import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trophy, TrendingUp, Medal } from 'lucide-react';

interface LeaderboardEntry {
  user_id: string;
  eco_points: number;
  total_impact_score: number;
  items_sold: number;
  items_donated: number;
  items_recycled: number;
  co2_offset_kg: number;
  profiles: {
    full_name: string | null;
    avatar_url: string | null;
  };
}

const Leaderboard = () => {
  const [topEcoPoints, setTopEcoPoints] = useState<LeaderboardEntry[]>([]);
  const [topImpact, setTopImpact] = useState<LeaderboardEntry[]>([]);
  const [topSellers, setTopSellers] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeaderboards();
  }, []);

  const fetchLeaderboards = async () => {
    try {
      // Fetch top eco points with profiles
      const { data: statsData } = await supabase
        .from('sustainability_stats')
        .select('*')
        .order('eco_points', { ascending: false })
        .limit(10);

      if (statsData) {
        // Fetch profiles separately
        const userIds = statsData.map(s => s.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .in('user_id', userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]));
        
        const enrichedData = statsData.map(stat => ({
          ...stat,
          profiles: profilesMap.get(stat.user_id) || { full_name: null, avatar_url: null }
        }));

        setTopEcoPoints(enrichedData);
      }

      // Fetch top impact score
      const { data: impactStats } = await supabase
        .from('sustainability_stats')
        .select('*')
        .order('total_impact_score', { ascending: false })
        .limit(10);

      if (impactStats) {
        const userIds = impactStats.map(s => s.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .in('user_id', userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]));
        
        const enrichedData = impactStats.map(stat => ({
          ...stat,
          profiles: profilesMap.get(stat.user_id) || { full_name: null, avatar_url: null }
        }));

        setTopImpact(enrichedData);
      }

      // Fetch top sellers
      const { data: sellersStats } = await supabase
        .from('sustainability_stats')
        .select('*')
        .order('items_sold', { ascending: false })
        .limit(10);

      if (sellersStats) {
        const userIds = sellersStats.map(s => s.user_id);
        const { data: profilesData } = await supabase
          .from('profiles')
          .select('user_id, full_name, avatar_url')
          .in('user_id', userIds);

        const profilesMap = new Map(profilesData?.map(p => [p.user_id, p]));
        
        const enrichedData = sellersStats.map(stat => ({
          ...stat,
          profiles: profilesMap.get(stat.user_id) || { full_name: null, avatar_url: null }
        }));

        setTopSellers(enrichedData);
      }
    } catch (error) {
      console.error('Error fetching leaderboards:', error);
    } finally {
      setLoading(false);
    }
  };

  const getMedalIcon = (rank: number) => {
    switch (rank) {
      case 1: return '🥇';
      case 2: return '🥈';
      case 3: return '🥉';
      default: return `#${rank}`;
    }
  };

      const renderLeaderboardList = (entries: LeaderboardEntry[], valueKey: keyof LeaderboardEntry, suffix: string = '') => (
    <div className="space-y-3">
      {entries.map((entry, index) => {
        const displayValue = typeof entry[valueKey] === 'number' 
          ? (entry[valueKey] as number).toFixed(valueKey === 'co2_offset_kg' ? 1 : 0)
          : String(entry[valueKey]);

        return (
          <Card key={entry.user_id} className={index < 3 ? 'border-primary/30' : ''}>
            <CardContent className="p-4">
              <div className="flex items-center gap-4">
                <div className="text-2xl font-bold w-12 text-center">
                  {getMedalIcon(index + 1)}
                </div>
                
                <Avatar className="h-12 w-12">
                  <AvatarImage src={entry.profiles?.avatar_url || ''} />
                  <AvatarFallback>
                    {entry.profiles?.full_name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1">
                  <h4 className="font-semibold">
                    {entry.profiles?.full_name || 'Anonymous User'}
                  </h4>
                  <div className="flex flex-wrap gap-2 text-sm text-muted-foreground mt-1">
                    <span>Sold: {entry.items_sold}</span>
                    <span>•</span>
                    <span>Donated: {entry.items_donated}</span>
                    <span>•</span>
                    <span>Recycled: {entry.items_recycled}</span>
                  </div>
                </div>

                <div className="text-right">
                  <p className="text-2xl font-bold text-primary">
                    {displayValue}{suffix}
                  </p>
                  {valueKey === 'eco_points' && (
                    <p className="text-xs text-muted-foreground mt-1">EcoPoints</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center">Loading leaderboard...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center gap-2 mb-2">
              <Trophy className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold">Eco Warriors Leaderboard</h1>
            </div>
            <p className="text-muted-foreground">
              See how you stack up against other sustainability champions
            </p>
          </div>

          <Tabs defaultValue="ecopoints" className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="ecopoints" className="gap-2">
                <Trophy className="h-4 w-4" />
                EcoPoints
              </TabsTrigger>
              <TabsTrigger value="impact" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Impact Score
              </TabsTrigger>
              <TabsTrigger value="sellers" className="gap-2">
                <Medal className="h-4 w-4" />
                Top Sellers
              </TabsTrigger>
            </TabsList>

            <TabsContent value="ecopoints">
              <Card>
                <CardHeader>
                  <CardTitle>Top EcoPoints Earners</CardTitle>
                  <CardDescription>
                    Users with the most accumulated EcoPoints
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderLeaderboardList(topEcoPoints, 'eco_points')}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="impact">
              <Card>
                <CardHeader>
                  <CardTitle>Highest Impact Score</CardTitle>
                  <CardDescription>
                    Users making the biggest environmental difference
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderLeaderboardList(topImpact, 'total_impact_score')}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="sellers">
              <Card>
                <CardHeader>
                  <CardTitle>Most Active Sellers</CardTitle>
                  <CardDescription>
                    Users who have sold the most items
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {renderLeaderboardList(topSellers, 'items_sold', ' items')}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Community Stats */}
          <Card className="mt-8 bg-gradient-to-br from-primary/10 to-accent/10">
            <CardHeader>
              <CardTitle>Community Impact</CardTitle>
              <CardDescription>Together we're making a difference</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {topEcoPoints.reduce((sum, e) => sum + e.items_sold, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Items Sold</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {topEcoPoints.reduce((sum, e) => sum + e.items_donated, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Items Donated</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {topEcoPoints.reduce((sum, e) => sum + e.co2_offset_kg, 0).toFixed(1)}kg
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">CO₂ Offset</p>
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">
                    {topEcoPoints.reduce((sum, e) => sum + e.eco_points, 0)}
                  </p>
                  <p className="text-sm text-muted-foreground mt-1">Total EcoPoints</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Leaderboard;
