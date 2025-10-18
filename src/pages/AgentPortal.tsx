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

const AgentPortal = () => {
  const stats = [
    { label: "Total Sales", value: "₹45,230", icon: IndianRupee, trend: "+12%" },
    { label: "Active Listings", value: "23", icon: Package, trend: "+3" },
    { label: "Completed Orders", value: "87", icon: CheckCircle, trend: "+8" },
    { label: "Pending Pickup", value: "5", icon: Clock, trend: "2 new" },
  ];

  const listings = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=100&h=100&fit=crop",
      title: "Vintage Denim Jacket",
      price: 1299,
      status: "active",
      views: 234,
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=100&h=100&fit=crop",
      title: "Designer Summer Dress",
      price: 899,
      status: "active",
      views: 189,
    },
  ];

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
              <Button variant="hero" size="lg">
                <PackageOpen className="h-4 w-4 mr-2" />
                List New Item
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {stats.map((stat, index) => (
                <Card key={index} className="border-border">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-2">
                      <stat.icon className="h-5 w-5 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs">
                        {stat.trend}
                      </Badge>
                    </div>
                    <p className="text-2xl font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </CardContent>
                </Card>
              ))}
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
                    {listings.map((listing) => (
                      <div
                        key={listing.id}
                        className="flex items-center gap-4 p-4 rounded-lg border border-border hover:border-primary transition-colors"
                      >
                        <img
                          src={listing.image}
                          alt={listing.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <h3 className="font-semibold">{listing.title}</h3>
                          <p className="text-sm text-muted-foreground">{listing.views} views</p>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">₹{listing.price}</p>
                          <Badge variant="secondary" className="mt-1">
                            {listing.status}
                          </Badge>
                        </div>
                        <Button variant="outline" size="sm">
                          Edit
                        </Button>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="orders" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Orders</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-center py-8">
                      Your recent orders will appear here
                    </p>
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
