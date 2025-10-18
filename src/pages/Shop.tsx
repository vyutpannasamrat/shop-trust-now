import { useState } from "react";
import Navbar from "@/components/Navbar";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, SlidersHorizontal } from "lucide-react";

const Shop = () => {
  const [searchQuery, setSearchQuery] = useState("");

  // Mock product data
  const products = [
    {
      id: "1",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=600&fit=crop",
      title: "Vintage Denim Jacket",
      price: 1299,
      originalPrice: 2499,
      seller: "FashionHub Delhi",
      verified: true,
      condition: "Like New",
    },
    {
      id: "2",
      image: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=400&h=600&fit=crop",
      title: "Designer Summer Dress",
      price: 899,
      seller: "StyleCorner Mumbai",
      verified: true,
      condition: "Excellent",
    },
    {
      id: "3",
      image: "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=600&fit=crop",
      title: "Classic White Sneakers",
      price: 1599,
      originalPrice: 2999,
      seller: "SneakerZone",
      verified: true,
      condition: "Good",
    },
    {
      id: "4",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=600&fit=crop",
      title: "Leather Crossbody Bag",
      price: 2199,
      seller: "LuxeAccessories",
      verified: true,
      condition: "Like New",
    },
    {
      id: "5",
      image: "https://images.unsplash.com/photo-1578681994506-b8f463449011?w=400&h=600&fit=crop",
      title: "Casual Blazer",
      price: 1799,
      originalPrice: 3499,
      seller: "FormalFashion",
      verified: true,
      condition: "Excellent",
    },
    {
      id: "6",
      image: "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=400&h=600&fit=crop",
      title: "Boho Maxi Skirt",
      price: 749,
      seller: "BohoChic",
      verified: false,
      condition: "Good",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-8">
            <div>
              <h1 className="text-4xl font-bold mb-2">Shop Fashion</h1>
              <p className="text-muted-foreground">
                Discover pre-loved fashion from verified sellers
              </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search for clothes, accessories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <div className="flex gap-2">
                <Select defaultValue="recent">
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Sort by" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="recent">Most Recent</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="popular">Most Popular</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline" size="icon">
                  <SlidersHorizontal className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} {...product} />
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Shop;
