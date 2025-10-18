import { useParams } from "react-router-dom";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ShieldCheck, TruckIcon, Heart, MapPin, Star } from "lucide-react";

const ProductDetail = () => {
  const { id } = useParams();

  // Mock product data
  const product = {
    id,
    images: [
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop",
      "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800&h=1000&fit=crop&sat=-100",
    ],
    title: "Vintage Denim Jacket",
    price: 1299,
    originalPrice: 2499,
    seller: {
      name: "FashionHub Delhi",
      rating: 4.8,
      totalSales: 234,
      verified: true,
      location: "Delhi, India",
    },
    condition: "Like New",
    description:
      "Classic vintage denim jacket in excellent condition. Perfect for layering and adding a casual touch to any outfit. Features authentic distressing and a comfortable fit.",
    details: {
      brand: "Levi's",
      size: "M",
      color: "Blue",
      material: "100% Cotton",
    },
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="space-y-4">
              <div className="aspect-[3/4] rounded-lg overflow-hidden">
                <img
                  src={product.images[0]}
                  alt={product.title}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="grid grid-cols-4 gap-2">
                {product.images.slice(0, 4).map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square rounded-lg overflow-hidden border-2 border-border hover:border-primary cursor-pointer transition-colors"
                  >
                    <img src={image} alt={`${product.title} ${index + 1}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            </div>

            <div className="space-y-6">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="secondary">{product.condition}</Badge>
                  {product.seller.verified && (
                    <Badge className="bg-primary">
                      <ShieldCheck className="h-3 w-3 mr-1" />
                      Verified Seller
                    </Badge>
                  )}
                </div>
                <h1 className="text-3xl md:text-4xl font-bold mb-4">{product.title}</h1>
                <div className="flex items-center gap-3">
                  <span className="text-3xl font-bold text-foreground">₹{product.price}</span>
                  {product.originalPrice && (
                    <>
                      <span className="text-xl text-muted-foreground line-through">₹{product.originalPrice}</span>
                      <Badge variant="destructive">
                        {Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}% OFF
                      </Badge>
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
                        <p className="font-semibold">{product.seller.name}</p>
                        <div className="flex items-center gap-1 text-sm text-muted-foreground">
                          <Star className="h-3 w-3 fill-accent text-accent" />
                          <span>{product.seller.rating}</span>
                          <span>({product.seller.totalSales} sales)</span>
                        </div>
                      </div>
                    </div>
                    <Button variant="outline" size="sm">
                      View Profile
                    </Button>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    {product.seller.location}
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
                  {Object.entries(product.details).map(([key, value]) => (
                    <div key={key}>
                      <p className="text-sm text-muted-foreground capitalize">{key}</p>
                      <p className="font-medium">{value}</p>
                    </div>
                  ))}
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
