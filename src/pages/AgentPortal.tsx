import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PackageOpen, 
  TrendingUp, 
  ShieldCheck, 
  IndianRupee,
  Package,
  CheckCircle,
  Clock
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  is_available: boolean;
}

interface Order {
  id: string;
  status: string;
  amount: number;
  created_at: string;
  product: {
    title: string;
    images: string[];
  };
}

const AgentPortal = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState({
    totalSales: 0,
    activeListings: 0,
    completedOrders: 0,
    pendingPickup: 0,
  });

  useEffect(() => {
    if (user) {
      fetchDashboardData();
    }
  }, [user]);

  const fetchDashboardData = async () => {
    try {
      // Fetch user's products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, title, price, images, is_available')
        .eq('seller_id', user!.id)
        .eq('is_available', true)
        .order('created_at', { ascending: false });

      if (productsError) throw productsError;
      setProducts(productsData || []);

      // Fetch user's orders as seller
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          amount,
          created_at,
          product:products(title, images)
        `)
        .eq('seller_id', user!.id)
        .order('created_at', { ascending: false })
        .limit(10);

      if (ordersError) throw ordersError;
      setOrders(ordersData || []);

      // Calculate stats
      const totalSales = ordersData
        ?.filter(o => o.status === 'delivered')
        .reduce((sum, o) => sum + Number(o.amount), 0) || 0;
      
      const completedOrders = ordersData?.filter(o => o.status === 'delivered').length || 0;
      const pendingPickup = ordersData?.filter(o => o.status === 'pending').length || 0;

      setStats({
        totalSales,
        activeListings: productsData?.length || 0,
        completedOrders,
        pendingPickup,
      });

    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      toast({
        title: 'Error',
        description: 'Failed to load dashboard data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h1 className="text-4xl font-bold mb-2">Seller Dashboard</h1>
                <p className="text-muted-foreground flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-primary" />
                  Verified Seller
                </p>
              </div>
              <Button variant="hero" size="lg" onClick={() => window.location.href = '/list-product'}>
                <PackageOpen className="h-4 w-4 mr-2" />
                List New Item
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <IndianRupee className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold mb-1">₹{stats.totalSales.toLocaleString()}</p>
                  <p className="text-sm text-muted-foreground">Total Sales</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold mb-1">{stats.activeListings}</p>
                  <p className="text-sm text-muted-foreground">Active Listings</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <CheckCircle className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold mb-1">{stats.completedOrders}</p>
                  <p className="text-sm text-muted-foreground">Completed Orders</p>
                </CardContent>
              </Card>

              <Card className="border-border">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-muted-foreground" />
                  </div>
                  <p className="text-2xl font-bold mb-1">{stats.pendingPickup}</p>
                  <p className="text-sm text-muted-foreground">Pending Pickup</p>
                </CardContent>
              </Card>
            </div>

            <Tabs defaultValue="listings" className="space-y-6">
              <TabsList className="grid w-full max-w-md grid-cols-3">
                <TabsTrigger value="listings">Listings</TabsTrigger>
                <TabsTrigger value="orders">Orders</TabsTrigger>
                <TabsTrigger value="analytics">Analytics</TabsTrigger>
              </TabsList>

              <TabsContent value="listings" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Active Listings</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : products.length === 0 ? (
                      <p className="text-center text-muted-foreground py-8">
                        No active listings. Start by listing a product!
                      </p>
                    ) : (
                      products.map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                          onClick={() => navigate(`/product/${product.id}`)}
                        >
                          <img
                            src={product.images[0] || '/placeholder.svg'}
                            alt={product.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{product.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {product.is_available ? 'Available' : 'Sold'}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{product.price}</p>
                            <Badge variant="secondary" className="mt-1">
                              active
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {loading ? (
                      <p className="text-center text-muted-foreground py-8">Loading...</p>
                    ) : orders.length === 0 ? (
                      <p className="text-muted-foreground text-center py-8">
                        No orders yet
                      </p>
                    ) : (
                      orders.map((order) => (
                        <div
                          key={order.id}
                          className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary transition-colors cursor-pointer"
                          onClick={() => navigate(`/tracking/${order.id}`)}
                        >
                          <img
                            src={order.product.images[0] || '/placeholder.svg'}
                            alt={order.product.title}
                            className="w-16 h-16 rounded-lg object-cover"
                          />
                          <div className="flex-1">
                            <h3 className="font-semibold">{order.product.title}</h3>
                            <p className="text-sm text-muted-foreground">
                              {new Date(order.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold">₹{Number(order.amount).toLocaleString()}</p>
                            <Badge variant="secondary" className="mt-1">
                              {order.status}
                            </Badge>
                          </div>
                        </div>
                      ))
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="analytics" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <TrendingUp className="h-5 w-5 text-primary" />
                      Sales Analytics
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Detailed analytics coming soon
                    </p>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AgentPortal;
