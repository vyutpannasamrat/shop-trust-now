import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Package, TruckIcon, CheckCircle, MapPin, Clock } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface OrderData {
  id: string;
  status: string;
  amount: number;
  created_at: string;
  pickup_address: string;
  delivery_address: string;
  product: {
    title: string;
    images: string[];
  };
  tracking_updates: any[];
}

const Tracking = () => {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [order, setOrder] = useState<OrderData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (orderId) {
      fetchOrderData();
    }
  }, [orderId]);

  const fetchOrderData = async () => {
    try {
      const { data, error } = await supabase
        .from('orders')
        .select(`
          id,
          status,
          amount,
          created_at,
          pickup_address,
          delivery_address,
          tracking_updates,
          product:products(title, images)
        `)
        .eq('id', orderId)
        .single();

      if (error) throw error;
      setOrder(data);
    } catch (error: any) {
      console.error('Error fetching order:', error);
      toast({
        title: 'Error',
        description: 'Could not find order',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const getTrackingSteps = () => {
    if (!order) return [];

    const statusMap: Record<string, number> = {
      'pending': 0,
      'assigned': 1,
      'picked_up': 2,
      'in_transit': 3,
      'delivered': 4,
    };

    const currentStep = statusMap[order.status] || 0;

    return [
      {
        status: currentStep >= 0 ? "completed" : "pending",
        title: "Order Confirmed",
        description: "Your order has been confirmed",
        time: new Date(order.created_at).toLocaleString(),
        icon: CheckCircle,
      },
      {
        status: currentStep >= 2 ? "completed" : currentStep === 1 ? "active" : "pending",
        title: "Picked Up",
        description: "Item picked up from seller",
        time: currentStep >= 2 ? "Completed" : "Pending",
        icon: Package,
      },
      {
        status: currentStep >= 3 ? "completed" : currentStep === 2 ? "active" : "pending",
        title: "In Transit",
        description: "On the way to delivery location",
        time: currentStep >= 3 ? "Completed" : "In Progress",
        icon: TruckIcon,
      },
      {
        status: currentStep >= 4 ? "completed" : currentStep === 3 ? "active" : "pending",
        title: "Delivered",
        description: "Package delivered successfully",
        time: currentStep >= 4 ? "Delivered" : "Pending",
        icon: MapPin,
      },
    ];
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
              <p className="text-muted-foreground">
                Real-time order tracking and updates
              </p>
            </div>

            {loading ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Clock className="h-12 w-12 text-muted-foreground mx-auto mb-4 animate-spin" />
                  <p className="text-muted-foreground">Loading order details...</p>
                </CardContent>
              </Card>
            ) : !order ? (
              <Card>
                <CardContent className="p-12 text-center">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h2 className="text-xl font-semibold mb-2">Order not found</h2>
                  <p className="text-muted-foreground mb-4">
                    The order you're looking for doesn't exist or you don't have access to it.
                  </p>
                  <Button onClick={() => navigate('/orders')}>
                    View My Orders
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Tracking Details</CardTitle>
                    <Badge variant="secondary" className="text-sm capitalize">
                      {order.status.replace('_', ' ')}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Item</p>
                      <p className="font-semibold">{order.product.title}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Order Amount</p>
                      <p className="font-semibold">₹{Number(order.amount).toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Pickup Address</p>
                      <p className="font-semibold text-sm">{order.pickup_address}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Delivery Address</p>
                      <p className="font-semibold text-sm">{order.delivery_address}</p>
                    </div>
                  </div>

                  <div className="relative space-y-6">
                    {getTrackingSteps().map((step, index) => {
                      const Icon = step.icon;
                      const trackingSteps = getTrackingSteps();
                      return (
                        <div key={index} className="relative flex gap-4">
                          {index !== trackingSteps.length - 1 && (
                            <div
                              className={`absolute left-5 top-12 w-0.5 h-full ${
                                step.status === "completed"
                                  ? "bg-primary"
                                  : "bg-border"
                              }`}
                            />
                          )}
                          <div
                            className={`relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 ${
                              step.status === "completed"
                                ? "bg-primary border-primary text-primary-foreground"
                                : step.status === "active"
                                ? "bg-background border-primary text-primary"
                                : "bg-background border-border text-muted-foreground"
                            }`}
                          >
                            <Icon className="h-5 w-5" />
                          </div>
                          <div className="flex-1 pb-8">
                            <div className="flex items-start justify-between">
                              <div>
                                <h3
                                  className={`font-semibold ${
                                    step.status === "pending"
                                      ? "text-muted-foreground"
                                      : "text-foreground"
                                  }`}
                                >
                                  {step.title}
                                </h3>
                                <p className="text-sm text-muted-foreground mt-1">
                                  {step.description}
                                </p>
                              </div>
                              <Badge
                                variant={
                                  step.status === "completed"
                                    ? "default"
                                    : step.status === "active"
                                    ? "secondary"
                                    : "outline"
                                }
                              >
                                {step.time}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Tracking;
