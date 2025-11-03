import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useCart } from '@/contexts/CartContext';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Wallet, CreditCard, Loader2 } from 'lucide-react';

const Checkout = () => {
  const navigate = useNavigate();
  const { items, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    address: '',
    city: '',
    pincode: '',
    notes: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to place an order",
        variant: "destructive"
      });
      navigate('/auth/login');
      return;
    }

    if (items.length === 0) {
      toast({
        title: "Cart is empty",
        description: "Add items to cart before checkout",
        variant: "destructive"
      });
      return;
    }

    setLoading(true);

    try {
      // Create orders for each item
      for (const item of items) {
        const { error } = await supabase
          .from('orders')
          .insert({
            buyer_id: user.id,
            seller_id: item.product.seller_id,
            product_id: item.product.id,
            amount: item.product.price * item.quantity,
            delivery_address: `${formData.fullName}, ${formData.phone}\n${formData.address}, ${formData.city}, ${formData.pincode}${formData.notes ? `\nNotes: ${formData.notes}` : ''}`,
            pickup_address: 'To be confirmed by seller',
            status: 'pending'
          });

        if (error) throw error;
      }

      await clearCart();

      toast({
        title: "Order placed successfully!",
        description: "You will receive your order confirmation shortly"
      });

      navigate('/orders');
    } catch (error) {
      console.error('Error placing order:', error);
      toast({
        title: "Order failed",
        description: "Failed to place order. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-background">
        <Navbar />
        <main className="pt-24 pb-16">
          <div className="container mx-auto px-4">
            <Card>
              <CardContent className="p-12 text-center">
                <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
                <p className="text-muted-foreground mb-6">Add items before checkout</p>
                <Button onClick={() => navigate('/shop')} variant="hero">
                  Go to Shop
                </Button>
              </CardContent>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <h1 className="text-4xl font-bold mb-8">Checkout</h1>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Delivery Information */}
            <Card>
              <CardHeader>
                <CardTitle>Delivery Information</CardTitle>
                <CardDescription>Enter your delivery details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name *</Label>
                    <Input
                      id="fullName"
                      name="fullName"
                      value={formData.fullName}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      name="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={3}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode">Pincode *</Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="notes">Additional Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleInputChange}
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
                <CardDescription>Choose your payment method</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="flex items-start space-x-3 p-4 border border-border rounded-lg bg-card cursor-pointer hover:bg-accent/5">
                    <RadioGroupItem value="cod" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <div className="flex items-center gap-2 mb-1">
                        <Wallet className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Cash on Delivery</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Pay with cash when your order is delivered
                      </p>
                    </Label>
                  </div>

                  <div className="flex items-start space-x-3 p-4 border border-border rounded-lg bg-muted/50 opacity-60 cursor-not-allowed">
                    <RadioGroupItem value="online" id="online" disabled />
                    <Label htmlFor="online" className="flex-1 cursor-not-allowed">
                      <div className="flex items-center gap-2 mb-1">
                        <CreditCard className="h-5 w-5 text-muted-foreground" />
                        <span className="font-semibold text-muted-foreground">Online Payment</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        UPI, Cards, Wallets - Coming Soon
                      </p>
                    </Label>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Order Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center">
                    <div className="flex gap-3">
                      <img
                        src={item.product.images[0] || '/placeholder.svg'}
                        alt={item.product.title}
                        className="w-16 h-16 object-cover rounded"
                      />
                      <div>
                        <p className="font-medium">{item.product.title}</p>
                        <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                      </div>
                    </div>
                    <p className="font-semibold">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                  </div>
                ))}

                <div className="border-t border-border pt-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Subtotal</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Shipping</span>
                    <span>FREE</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>₹{totalPrice.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex gap-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate('/cart')}
                className="flex-1"
              >
                Back to Cart
              </Button>
              <Button
                type="submit"
                variant="hero"
                className="flex-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Placing Order...
                  </>
                ) : (
                  'Place Order'
                )}
              </Button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default Checkout;
