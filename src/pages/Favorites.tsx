import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import ProductCard from '@/components/ProductCard';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface Product {
  id: string;
  title: string;
  price: number;
  original_price: number | null;
  images: string[];
  condition: string;
  verified: boolean;
  seller_id: string;
}

interface Favorite {
  id: string;
  product_id: string;
  product: Product;
  seller: {
    full_name: string;
  } | null;
}

const Favorites = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate('/auth/login');
      return;
    }
    fetchFavorites();
  }, [user, navigate]);

  const fetchFavorites = async () => {
    setLoading(true);
    try {
      const { data: favData, error: favError } = await supabase
        .from('favorites')
        .select('id, product_id')
        .eq('user_id', user!.id);

      if (favError) throw favError;

      if (favData && favData.length > 0) {
        const productIds = favData.map(f => f.product_id);
        
        const { data: productsData, error: productsError } = await supabase
          .from('products')
          .select('id, title, price, original_price, images, condition, verified, seller_id')
          .in('id', productIds);

        if (productsError) throw productsError;

        const sellerIds = productsData?.map(p => p.seller_id) || [];
        const { data: sellersData } = await supabase
          .from('profiles')
          .select('user_id, full_name')
          .in('user_id', sellerIds);

        const enrichedFavorites: Favorite[] = favData.map(fav => {
          const product = productsData?.find(p => p.id === fav.product_id);
          const seller = sellersData?.find(s => s.user_id === product?.seller_id);
          return {
            ...fav,
            product: product as Product,
            seller: seller ? { full_name: seller.full_name } : null,
          };
        }).filter(f => f.product);

        setFavorites(enrichedFavorites);
      } else {
        setFavorites([]);
      }
    } catch (error: any) {
      console.error('Error fetching favorites:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <p className="text-center text-muted-foreground">Loading favorites...</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-bold mb-8">My Favorites</h1>

          {favorites.length === 0 ? (
            <Card>
              <CardContent className="p-12 text-center">
                <Heart className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h2 className="text-2xl font-bold mb-2">No favorites yet</h2>
                <p className="text-muted-foreground mb-6">
                  Start adding products to your favorites!
                </p>
                <Button onClick={() => navigate('/shop')} variant="hero" size="lg">
                  Browse Products
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {favorites.map((fav) => (
                <ProductCard
                  key={fav.id}
                  id={fav.product.id}
                  image={fav.product.images[0] || '/placeholder.svg'}
                  title={fav.product.title}
                  price={fav.product.price}
                  originalPrice={fav.product.original_price || undefined}
                  seller={fav.seller?.full_name || 'Unknown Seller'}
                  verified={fav.product.verified}
                  condition={fav.product.condition}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Favorites;