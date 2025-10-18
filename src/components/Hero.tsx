import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, TruckIcon, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import heroImage from "@/assets/hero-fashion.jpg";

const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center pt-16">
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={heroImage}
          alt="Fashion collection"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background/95 to-background/80" />
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-3xl mx-auto text-center space-y-8 py-20">
          <Badge variant="secondary" className="px-4 py-2 text-sm font-medium">
            Trusted by 10,000+ Fashion Lovers
          </Badge>

          <h1 className="text-5xl md:text-7xl font-bold leading-tight">
            Shop Fashion with{" "}
            <span className="bg-gradient-to-r from-primary via-primary-glow to-accent bg-clip-text text-transparent">
              Verified Trust
            </span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Buy and sell pre-loved fashion with confidence. Verified pickups, live tracking, 
            and secure payments - all in one place.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/shop">
              <Button variant="hero" size="lg" className="w-full sm:w-auto">
                Start Shopping
              </Button>
            </Link>
            <Link to="/agent">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Become a Seller
              </Button>
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12">
            <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <ShieldCheck className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Verified Trust</h3>
              <p className="text-sm text-muted-foreground text-center">
                Every seller verified, every transaction secure
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <TruckIcon className="h-8 w-8 text-primary" />
              <h3 className="font-semibold">Live Tracking</h3>
              <p className="text-sm text-muted-foreground text-center">
                Track your order in real-time from pickup to delivery
              </p>
            </div>

            <div className="flex flex-col items-center space-y-2 p-6 rounded-lg bg-card/50 backdrop-blur-sm border border-border">
              <Heart className="h-8 w-8 text-accent" />
              <h3 className="font-semibold">Donate & Impact</h3>
              <p className="text-sm text-muted-foreground text-center">
                Give back with every purchase through our donation program
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
