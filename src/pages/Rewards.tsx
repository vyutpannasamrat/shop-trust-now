import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Gift, Sparkles, Tag, Lock } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

interface Reward {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  eco_points_cost: number;
  reward_type: string;
  reward_value: any;
  stock_quantity: number | null;
}

interface Redemption {
  id: string;
  status: string;
  eco_points_spent: number;
  redeemed_at: string;
  redemption_code: string | null;
  rewards: {
    title: string;
    reward_type: string;
  };
}

const Rewards = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [rewards, setRewards] = useState<Reward[]>([]);
  const [redemptions, setRedemptions] = useState<Redemption[]>([]);
  const [ecoPoints, setEcoPoints] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchData();
    }
  }, [user]);

  const fetchData = async () => {
    try {
      // Fetch available rewards
      const { data: rewardsData } = await supabase
        .from('rewards')
        .select('*')
        .eq('active', true)
        .order('eco_points_cost', { ascending: true });

      if (rewardsData) {
        setRewards(rewardsData);
      }

      // Fetch user's eco points
      const { data: statsData } = await supabase
        .from('sustainability_stats')
        .select('eco_points')
        .eq('user_id', user!.id)
        .single();

      if (statsData) {
        setEcoPoints(statsData.eco_points);
      }

      // Fetch redemption history with reward details
      const { data: redemptionsData } = await supabase
        .from('reward_redemptions')
        .select('*')
        .eq('user_id', user!.id)
        .order('redeemed_at', { ascending: false });

      if (redemptionsData && redemptionsData.length > 0) {
        // Fetch reward details
        const rewardIds = redemptionsData.map(r => r.reward_id);
        const { data: rewardsDetails } = await supabase
          .from('rewards')
          .select('id, title, reward_type')
          .in('id', rewardIds);

        const rewardsMap = new Map(rewardsDetails?.map(r => [r.id, r]));
        
        const enrichedRedemptions = redemptionsData.map(rd => ({
          ...rd,
          rewards: rewardsMap.get(rd.reward_id) || { title: 'Unknown', reward_type: 'unknown' }
        }));

        setRedemptions(enrichedRedemptions);
      }
    } catch (error) {
      console.error('Error fetching rewards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (reward: Reward) => {
    if (!user) {
      toast({
        title: "Login required",
        description: "Please login to redeem rewards",
        variant: "destructive"
      });
      return;
    }

    if (ecoPoints < reward.eco_points_cost) {
      toast({
        title: "Insufficient EcoPoints",
        description: `You need ${reward.eco_points_cost - ecoPoints} more EcoPoints`,
        variant: "destructive"
      });
      return;
    }

    try {
      // Create redemption
      const { data, error } = await supabase
        .from('reward_redemptions')
        .insert({
          user_id: user.id,
          reward_id: reward.id,
          eco_points_spent: reward.eco_points_cost,
          redemption_code: `CODE-${Date.now()}`
        })
        .select()
        .single();

      if (error) throw error;

      // Deduct eco points
      const { error: updateError } = await supabase
        .from('sustainability_stats')
        .update({ eco_points: ecoPoints - reward.eco_points_cost })
        .eq('user_id', user.id);

      if (updateError) throw updateError;

      toast({
        title: "Reward redeemed!",
        description: `You've successfully redeemed: ${reward.title}`
      });

      // Refresh data
      fetchData();
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast({
        title: "Redemption failed",
        description: "Please try again later",
        variant: "destructive"
      });
    }
  };

  const getRewardIcon = (type: string) => {
    switch (type) {
      case 'discount': return '🎫';
      case 'donation': return '🌳';
      case 'feature_unlock': return '⭐';
      case 'physical': return '👕';
      default: return '🎁';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-500';
      case 'approved': return 'bg-blue-500';
      case 'completed': return 'bg-green-500';
      case 'cancelled': return 'bg-red-500';
      default: return 'bg-gray-500';
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
                <p className="text-muted-foreground mb-6">Please login to view and redeem rewards</p>
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

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center">Loading rewards...</p>
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
            <h1 className="text-4xl font-bold mb-2">Rewards Store</h1>
            <p className="text-muted-foreground">Redeem your EcoPoints for exclusive rewards</p>
          </div>

          {/* EcoPoints Balance */}
          <Card className="mb-8 bg-gradient-to-r from-primary/20 to-accent/20">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Sparkles className="h-8 w-8 text-primary" />
                  <div>
                    <p className="text-sm text-muted-foreground">Your Balance</p>
                    <p className="text-3xl font-bold">{ecoPoints} EcoPoints</p>
                  </div>
                </div>
                <Link to="/sustainability">
                  <Button variant="outline">View Dashboard</Button>
                </Link>
              </div>
            </CardContent>
          </Card>

          <Tabs defaultValue="available" className="space-y-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="available" className="gap-2">
                <Gift className="h-4 w-4" />
                Available Rewards
              </TabsTrigger>
              <TabsTrigger value="history" className="gap-2">
                <Tag className="h-4 w-4" />
                My Redemptions
              </TabsTrigger>
            </TabsList>

            <TabsContent value="available">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {rewards.map((reward) => {
                  const canAfford = ecoPoints >= reward.eco_points_cost;
                  const isOutOfStock = reward.stock_quantity !== null && reward.stock_quantity <= 0;

                  return (
                    <Card key={reward.id} className={!canAfford || isOutOfStock ? 'opacity-60' : ''}>
                      <CardHeader>
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-4xl">{getRewardIcon(reward.reward_type)}</span>
                          <Badge variant="outline" className="gap-1">
                            <Sparkles className="h-3 w-3" />
                            {reward.eco_points_cost}
                          </Badge>
                        </div>
                        <CardTitle>{reward.title}</CardTitle>
                        <CardDescription>{reward.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        {isOutOfStock ? (
                          <Button disabled className="w-full gap-2">
                            <Lock className="h-4 w-4" />
                            Out of Stock
                          </Button>
                        ) : !canAfford ? (
                          <Button disabled className="w-full gap-2">
                            <Lock className="h-4 w-4" />
                            Need {reward.eco_points_cost - ecoPoints} more
                          </Button>
                        ) : (
                          <Button 
                            onClick={() => handleRedeem(reward)}
                            variant="hero"
                            className="w-full"
                          >
                            Redeem Now
                          </Button>
                        )}
                        {reward.stock_quantity !== null && (
                          <p className="text-xs text-muted-foreground text-center mt-2">
                            {reward.stock_quantity} left in stock
                          </p>
                        )}
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="history">
              {redemptions.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Gift className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">No redemptions yet</h3>
                    <p className="text-muted-foreground">Start redeeming rewards with your EcoPoints!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-4">
                  {redemptions.map((redemption) => (
                    <Card key={redemption.id}>
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <span className="text-3xl">{getRewardIcon(redemption.rewards.reward_type)}</span>
                            <div>
                              <h4 className="font-semibold">{redemption.rewards.title}</h4>
                              <p className="text-sm text-muted-foreground">
                                Redeemed {new Date(redemption.redeemed_at).toLocaleDateString()}
                              </p>
                              {redemption.redemption_code && (
                                <p className="text-xs text-primary mt-1 font-mono">
                                  Code: {redemption.redemption_code}
                                </p>
                              )}
                            </div>
                          </div>
                          <div className="text-right">
                            <Badge className={getStatusColor(redemption.status)}>
                              {redemption.status}
                            </Badge>
                            <p className="text-sm text-muted-foreground mt-2">
                              -{redemption.eco_points_spent} points
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Rewards;
