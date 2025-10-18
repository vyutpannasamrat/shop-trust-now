import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Heart, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface ProductCardProps {
  id: string;
  image: string;
  title: string;
  price: number;
  originalPrice?: number;
  seller: string;
  verified: boolean;
  condition: string;
}

const ProductCard = ({
  id,
  image,
  title,
  price,
  originalPrice,
  seller,
  verified,
  condition,
}: ProductCardProps) => {
  return (
    <Link to={`/product/${id}`}>
      <Card className="group overflow-hidden hover:shadow-[var(--shadow-elegant)] transition-all duration-300 border-border">
        <div className="relative overflow-hidden aspect-[3/4]">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 backdrop-blur-sm hover:bg-background"
            onClick={(e) => {
              e.preventDefault();
            }}
          >
            <Heart className="h-4 w-4" />
          </Button>
          {verified && (
            <Badge className="absolute top-2 left-2 bg-primary/90 backdrop-blur-sm">
              <ShieldCheck className="h-3 w-3 mr-1" />
              Verified
            </Badge>
          )}
        </div>

        <CardContent className="p-4 space-y-2">
          <div className="flex items-start justify-between">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
              {title}
            </h3>
            <Badge variant="secondary" className="ml-2">
              {condition}
            </Badge>
          </div>

          <p className="text-sm text-muted-foreground">by {seller}</p>

          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-foreground">₹{price}</span>
            {originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                ₹{originalPrice}
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ProductCard;
