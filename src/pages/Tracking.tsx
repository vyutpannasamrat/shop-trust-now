import { useState } from "react";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Package, TruckIcon, CheckCircle, MapPin } from "lucide-react";

const Tracking = () => {
  const [trackingId, setTrackingId] = useState("");
  const [showTracking, setShowTracking] = useState(false);

  const handleTrack = () => {
    if (trackingId) {
      setShowTracking(true);
    }
  };

  const trackingSteps = [
    {
      status: "completed",
      title: "Order Confirmed",
      description: "Your order has been confirmed",
      time: "Today, 10:30 AM",
      icon: CheckCircle,
    },
    {
      status: "completed",
      title: "Picked Up",
      description: "Item picked up from seller",
      time: "Today, 2:15 PM",
      icon: Package,
    },
    {
      status: "active",
      title: "In Transit",
      description: "On the way to delivery location",
      time: "Expected: Today, 6:00 PM",
      icon: TruckIcon,
    },
    {
      status: "pending",
      title: "Out for Delivery",
      description: "Package out for delivery",
      time: "Pending",
      icon: MapPin,
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-2">Track Your Order</h1>
              <p className="text-muted-foreground">
                Enter your tracking ID to see real-time updates
              </p>
            </div>

            <Card>
              <CardContent className="p-6">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      placeholder="Enter tracking ID (e.g., TRK123456)"
                      value={trackingId}
                      onChange={(e) => setTrackingId(e.target.value)}
                      className="pl-10"
                      onKeyPress={(e) => e.key === "Enter" && handleTrack()}
                    />
                  </div>
                  <Button variant="hero" onClick={handleTrack}>
                    Track
                  </Button>
                </div>
              </CardContent>
            </Card>

            {showTracking && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>Tracking Details</CardTitle>
                    <Badge variant="secondary" className="text-sm">
                      ID: {trackingId}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Item</p>
                      <p className="font-semibold">Vintage Denim Jacket</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Estimated Delivery</p>
                      <p className="font-semibold">Today, 6:00 PM</p>
                    </div>
                  </div>

                  <div className="relative space-y-6">
                    {trackingSteps.map((step, index) => {
                      const Icon = step.icon;
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
