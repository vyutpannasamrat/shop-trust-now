import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { Package, TruckIcon, CheckCircle, XCircle, Clock } from 'lucide-react';
import { format } from 'date-fns';

interface Order {
  id: string;
  product_id: string;
  status: string;
  amount: number;
  created_at: string;
  pickup_address: string;
  delivery_address: string;
  product: {
    title: string;
    images: string[];
  } | null;
}

const Orders = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [buyOrders, setBuyOrders] = useState<Order[]>([]);
  const [sellOrders, setSellOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    fetchOrders();
  }, [user, navigate]);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      // Fetch orders where user is buyer
      const { data: buyData, error: buyError } = await supabase
        .from('orders')
        .select('id, product_id, status, amount, created_at, pickup_address, delivery_address')
        .eq('buyer_id', user!.id)
        .order('created_at', { ascending: false });

      if (buyError) throw buyError;

      // Fetch orders where user is seller
      const { data: sellData, error: sellError } = await supabase
        .from('orders')
        .select('id, product_id, status, amount, created_at, pickup_address, delivery_address')
        .eq('seller_id', user!.id)
        .order('created_at', { ascending: false });

      if (sellError) throw sellError;

      // Fetch product details for all orders
      const allProductIds = [
        ...(buyData || []).map(o => o.product_id),
        ...(sellData || []).map(o => o.product_id),
      ];

      if (allProductIds.length > 0) {
        const { data: productsData } = await supabase
          .from('products')
          .select('id, title, images')
          .in('id', allProductIds);

        const enrichOrders = (orders: any[]) =>
          orders.map(order => ({
            ...order,
            product: productsData?.find(p => p.id === order.product_id) || null,
          }));

        setBuyOrders(enrichOrders(buyData || []));
        setSellOrders(enrichOrders(sellData || []));
      }
    } catch (error: any) {
      console.error('Error fetching orders:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'delivered':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'cancelled':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'in_transit':
        return <TruckIcon className="h-5 w-5 text-blue-500" />;
      case 'picked_up':
        return <Package className="h-5 w-5 text-purple-500" />;
      default:
        return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusVariant = (status: string): "default" | "secondary" | "destructive" | "outline" => {
    switch (status) {
      case 'delivered':
        return 'default';
      case 'cancelled':
        return 'destructive';
      case 'in_transit':
      case 'picked_up':
        return 'secondary';
      default:
        return 'outline';
    }
  };

  const OrderCard = ({ order }: { order: Order }) => (
    <Card className="hover:shadow-[var(--shadow-elegant)] transition-all">
      <CardContent className="p-6">
        <div className="flex gap-4">
          {order.product?.images[0] && (
            <img
              src={order.product.images[0]}
              alt={order.product.title}
              className="w-24 h-24 object-cover rounded-lg"
            />
          )}
          <div className="flex-1">
            <div className="flex items-start justify-between mb-2">
              <div>
                <h3 className="font-semibold text-lg">{order.product?.title || 'Product'}</h3>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(order.created_at), 'MMM dd, yyyy')}
                </p>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(order.status)}
                <Badge variant={getStatusVariant(order.status)}>
                  {order.status.replace('_', ' ')}
                </Badge>
              </div>
            </div>
            <p className="text-xl font-bold mb-3">₹{order.amount}</p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/tracking/${order.id}`)}
              >
                Track Order
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-6xl">
          <h1 className="text-4xl font-bold mb-8">My Orders</h1>

          <Tabs defaultValue="purchases" className="space-y-6">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="purchases">Purchases</TabsTrigger>
              <TabsTrigger value="sales">Sales</TabsTrigger>
            </TabsList>

            <TabsContent value="purchases" className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading orders...</p>
              ) : buyOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't placed any orders yet</p>
                    <Button onClick={() => navigate('/shop')}>Start Shopping</Button>
                  </CardContent>
                </Card>
              ) : (
                buyOrders.map(order => <OrderCard key={order.id} order={order} />)
              )}
            </TabsContent>

            <TabsContent value="sales" className="space-y-4">
              {loading ? (
                <p className="text-center text-muted-foreground py-8">Loading orders...</p>
              ) : sellOrders.length === 0 ? (
                <Card>
                  <CardContent className="p-12 text-center">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">You haven't sold anything yet</p>
                    <Button onClick={() => navigate('/list-product')}>List a Product</Button>
                  </CardContent>
                </Card>
              ) : (
                sellOrders.map(order => <OrderCard key={order.id} order={order} />)
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default Orders;