import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { ShieldCheck, TruckIcon, Heart, MapPin, Star, Loader2 } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();

  const { data: product, isLoading } = useQuery({
    queryKey: ['product', id],
    queryFn: async () => {
      const { data: productData, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;

      // Fetch seller profile
      const { data: profile } = await supabase
        .from('profiles')
        .select('full_name, city')
        .eq('user_id', productData.seller_id)
        .single();

      return {
        ...productData,
        profile,
      };
    },
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <div className="flex justify-center items-center min-h-[60vh]">
          <p className="text-muted-foreground">Product not found</p>
        </div>
      </div>
    );
  }

  const conditionLabel = product.condition.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase());

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src={product.images[0] || "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop"}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              {product.images.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {product.images.slice(0, 4).map((image: string, index: number) => (
                    <div
                      key={index}
                      className="aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary cursor-pointer transition-colors"
                    >
                      <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{conditionLabel}</Badge>
                  {product.verified && (
                    <Badge className="bg-primary">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified Seller
                    </Badge>
                  )}
                  {product.is_donation && (
                    <Badge className="bg-accent">
                      Free Donation
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
                <div className="flex items-center gap-3">
                  {product.is_donation ? (
                    <span className="text-3xl font-bold text-accent">Free</span>
                  ) : (
                    <>
                      <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
                      {product.original_price && (
                        <>
                          <span className="text-xl text-muted-foreground line-through">₹{product.original_price}</span>
                          <Badge variant="destructive">
                            {Math.round(((product.original_price - product.price) / product.original_price) * 100)}% OFF
                          </Badge>
                        </>
                      )}
                    </>
                  )}
                </div>
              </div>

              <Separator />

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <ShieldCheck className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">{product.profile?.full_name || "Unknown Seller"}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <MapPin className="h-3 w-3" />
                          <span>{product.profile?.city || "Unknown City"}</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-3">
                <Button variant="hero" size="lg" className="w-full">
                  Add to Cart
                </Button>
                <Button variant="outline" size="lg" className="w-full">
                  <Heart className="h-4 w-4 mr-2" />
                  Add to Wishlist
                </Button>
              </div>

              <Card>
                <CardContent className="p-4 space-y-3">
                  <div className="flex items-center gap-3">
                    <TruckIcon className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Free Verified Pickup & Delivery</p>
                      <p className="text-sm text-muted-foreground">Live tracking available</p>
                    </div>
                  </div>
                  <Separator />
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-semibold">Trust Protection</p>
                      <p className="text-sm text-muted-foreground">Secure payment & buyer protection</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div>
                <h2 className="text-xl font-semibold mb-3">Description</h2>
                <p className="text-muted-foreground">{product.description}</p>
              </div>

              <div>
                <h2 className="text-xl font-semibold mb-3">Product Details</h2>
                <div className="grid grid-cols-2 gap-3">
                  {product.brand && (
                    <div>
                      <p className="text-sm text-muted-foreground">Brand</p>
                      <p className="font-medium">{product.brand}</p>
                    </div>
                  )}
                  {product.size && (
                    <div>
                      <p className="text-sm text-muted-foreground">Size</p>
                      <p className="font-medium">{product.size}</p>
                    </div>
                  )}
                  {product.color && (
                    <div>
                      <p className="text-sm text-muted-foreground">Color</p>
                      <p className="font-medium">{product.color}</p>
                    </div>
                  )}
                  {product.material && (
                    <div>
                      <p className="text-sm text-muted-foreground">Material</p>
                      <p className="font-medium">{product.material}</p>
                    </div>
                  )}
                  {product.gender && (
                    <div>
                      <p className="text-sm text-muted-foreground">Gender</p>
                      <p className="font-medium capitalize">{product.gender}</p>
                    </div>
                  )}
                  {product.category && (
                    <div>
                      <p className="text-sm text-muted-foreground">Category</p>
                      <p className="font-medium capitalize">{product.category}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
