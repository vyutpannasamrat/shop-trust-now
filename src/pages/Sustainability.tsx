import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Leaf, Droplets, TreePine, TrendingUp, Award, Gift } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface SustainabilityStats {
  items_sold: number;
  items_donated: number;
  items_recycled: number;
  co2_offset_kg: number;
  water_saved_liters: number;
  trees_saved: number;
  eco_points: number;
  total_impact_score: number;
}

interface UserBadge {
  id: string;
  earned_at: string;
  badges: {
    name: string;
    description: string;
    icon: string;
    tier: string;
    eco_points_reward: number;
  };
}

const Sustainability = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<SustainabilityStats | null>(null);
  const [badges, setBadges] = useState<UserBadge[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch sustainability stats
      const { data: statsData } = await supabase
        .from('sustainability_stats')
        .select('*')
        .eq('user_id', user!.id)
        .single();

      if (statsData) {
        setStats(statsData);
      }

      // Fetch earned badges separately
      const { data: userBadgesData } = await supabase
        .from('user_badges')
        .select('id, earned_at, badge_id')
        .eq('user_id', user!.id)
        .order('earned_at', { ascending: false });

      if (userBadgesData && userBadgesData.length > 0) {
        // Fetch badge details
        const badgeIds = userBadgesData.map(ub => ub.badge_id);
        const { data: badgesDetails } = await supabase
          .from('badges')
          .select('*')
          .in('id', badgeIds);

        const badgesMap = new Map(badgesDetails?.map(b => [b.id, b]));
        
        const enrichedBadges = userBadgesData.map(ub => ({
          id: ub.id,
          earned_at: ub.earned_at,
          badges: badgesMap.get(ub.badge_id)!
        }));

        setBadges(enrichedBadges);
      }
    } catch (error) {
      console.error('Error fetching sustainability data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'bronze': return 'bg-amber-700 text-white';
      case 'silver': return 'bg-gray-400 text-black';
      case 'gold': return 'bg-yellow-400 text-black';
      case 'platinum': return 'bg-gradient-to-r from-cyan-500 to-blue-500 text-white';
      default: return 'bg-muted';
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card>
              <CardContent className="p-12 text-center">
                <h2 className="text-2xl font-bold mb-4">Login Required</h2>
                <p className="text-muted-foreground mb-6">Please login to view your sustainability dashboard</p>
                <Link to="/auth/login">
                  <Button variant="hero">Login</Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  if (loading || !stats) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center">Loading...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="mb-8">
            <h1 className="text-4xl font-bold mb-2">Your Sustainability Impact</h1>
            <p className="text-muted-foreground">Track your eco-friendly contributions and earn rewards</p>
          </div>

          {/* EcoPoints Card */}
          <Card className="mb-8 bg-gradient-to-br from-primary/10 via-primary-glow/10 to-accent/10 border-primary/20">
            <CardContent className="p-8">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-1">Your EcoPoints</p>
                  <h2 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                    {stats.eco_points}
                  </h2>
                  <p className="text-sm text-muted-foreground mt-2">
                    Impact Score: {stats.total_impact_score}
                  </p>
                </div>
                <Link to="/rewards">
                  <Button variant="hero" size="lg" className="gap-2">
                    <Gift className="h-5 w-5" />
                    Redeem Rewards
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          {/* Impact Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Leaf className="h-5 w-5 text-primary" />
                  <CardTitle>CO₂ Offset</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.co2_offset_kg.toFixed(1)} kg</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Equivalent to driving {(stats.co2_offset_kg * 4.5).toFixed(0)}km less
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Droplets className="h-5 w-5 text-primary" />
                  <CardTitle>Water Saved</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.water_saved_liters.toFixed(0)} L</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Enough for {Math.floor(stats.water_saved_liters / 200)} showers
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="flex items-center gap-2">
                  <TreePine className="h-5 w-5 text-primary" />
                  <CardTitle>Trees Saved</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{stats.trees_saved.toFixed(2)}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Contributing to reforestation
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Activity Stats */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Your Activity
              </CardTitle>
              <CardDescription>Items contributed to circular fashion</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Items Sold</span>
                  <span className="text-sm text-muted-foreground">{stats.items_sold}</span>
                </div>
                <Progress value={(stats.items_sold / 100) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Items Donated</span>
                  <span className="text-sm text-muted-foreground">{stats.items_donated}</span>
                </div>
                <Progress value={(stats.items_donated / 100) * 100} className="h-2" />
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Items Recycled</span>
                  <span className="text-sm text-muted-foreground">{stats.items_recycled}</span>
                </div>
                <Progress value={(stats.items_recycled / 100) * 100} className="h-2" />
              </div>
            </CardContent>
          </Card>

          {/* Badges Section */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <Award className="h-5 w-5" />
                    Your Achievements
                  </CardTitle>
                  <CardDescription>Badges earned for your contributions</CardDescription>
                </div>
                <Link to="/leaderboard">
                  <Button variant="outline">View Leaderboard</Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {badges.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No badges earned yet. Start selling, donating, or recycling to earn achievements!
                </p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {badges.map((userBadge) => (
                    <Card key={userBadge.id} className="overflow-hidden">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <span className="text-4xl">{userBadge.badges.icon}</span>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h4 className="font-semibold">{userBadge.badges.name}</h4>
                              <Badge className={getTierColor(userBadge.badges.tier)}>
                                {userBadge.badges.tier}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground mb-2">
                              {userBadge.badges.description}
                            </p>
                            <p className="text-xs text-primary font-medium">
                              +{userBadge.badges.eco_points_reward} EcoPoints
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default Sustainability;
