import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Heart, Users, Shirt, TrendingUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface NGO {
  id: string;
  name: string;
  description: string;
  image_url: string;
  items_distributed: number;
}

const Donate = () => {
  const navigate = useNavigate();
  const [ngos, setNgos] = useState<NGO[]>([]);
  const [loading, setLoading] = useState(true);

  const impactStats = [
    { label: "Items Donated", value: "12,450", icon: Shirt },
    { label: "Families Helped", value: "3,200", icon: Users },
    { label: "This Month", value: "+450", icon: TrendingUp },
  ];

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const { data, error } = await supabase
        .from('ngos')
        .select('id, name, description, image_url, items_distributed')
        .eq('active', true)
        .order('items_distributed', { ascending: false });

      if (error) throw error;
      setNgos(data || []);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-12">
            <div className="text-center max-w-3xl mx-auto space-y-4">
              <div className="inline-flex items-center justify-center p-3 bg-accent/10 rounded-full mb-4">
                <Heart className="h-8 w-8 text-accent" />
              </div>
              <h1 className="text-4xl md:text-5xl font-bold">
                Make an Impact with Every Purchase
              </h1>
              <p className="text-xl text-muted-foreground">
                When you shop on StyleHub, a portion of proceeds goes directly to verified NGOs 
                helping families in need. Together, we're making fashion sustainable and meaningful.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {impactStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} className="text-center border-border">
                    <CardContent className="p-6">
                      <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                      <p className="text-3xl font-bold mb-1">{stat.value}</p>
                      <p className="text-muted-foreground">{stat.label}</p>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <div>
              <h2 className="text-3xl font-bold mb-6 text-center">Our Partner NGOs</h2>
              {loading ? (
                <p className="text-center text-muted-foreground">Loading NGOs...</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {ngos.map((ngo) => (
                    <Card key={ngo.id} className="overflow-hidden border-border hover:shadow-[var(--shadow-elegant)] transition-all">
                      <div className="aspect-video overflow-hidden">
                        <img
                          src={ngo.image_url || "https://images.unsplash.com/photo-1559027615-cd4628902d4a?w=400&h=300&fit=crop"}
                          alt={ngo.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          {ngo.name}
                          <Heart className="h-4 w-4 text-accent fill-accent" />
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <p className="text-sm text-muted-foreground">{ngo.description}</p>
                        <div className="pt-2 border-t border-border">
                          <p className="text-sm font-semibold text-primary">
                            {ngo.items_distributed} items distributed
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>

            <Card className="bg-gradient-to-br from-primary/5 to-accent/5 border-border">
              <CardContent className="p-8 text-center space-y-4">
                <h2 className="text-2xl md:text-3xl font-bold">
                  Want to Donate Directly?
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  List your pre-loved clothes on StyleHub and choose to donate all proceeds 
                  to the NGO of your choice. Every item makes a difference!
                </p>
                <Button variant="hero" size="lg" onClick={() => navigate('/list-product?donation=true')}>
                  Start Donating
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Donate;
