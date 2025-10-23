import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { Upload, X, Loader2 } from "lucide-react";

interface NGO {
  id: string;
  name: string;
  description: string;
}

const ListProduct = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [images, setImages] = useState<File[]>([]);
  const [previewUrls, setPreviewUrls] = useState<string[]>([]);
  const [ngos, setNgos] = useState<NGO[]>([]);

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    brand: "",
    size: "",
    color: "",
    gender: "",
    condition: "good",
    price: "",
    original_price: "",
    is_donation: searchParams.get('donation') === 'true',
    ngo_id: "",
    material: "",
    care_instructions: "",
  });

  useEffect(() => {
    fetchNGOs();
  }, []);

  const fetchNGOs = async () => {
    try {
      const { data, error } = await supabase
        .from('ngos')
        .select('id, name, description')
        .eq('active', true)
        .order('name');

      if (error) throw error;
      setNgos(data || []);
    } catch (error) {
      console.error('Error fetching NGOs:', error);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (images.length + files.length > 5) {
      toast({
        title: "Too many images",
        description: "You can upload maximum 5 images per product",
        variant: "destructive",
      });
      return;
    }

    setImages([...images, ...files]);
    
    // Create preview URLs
    const newPreviewUrls = files.map(file => URL.createObjectURL(file));
    setPreviewUrls([...previewUrls, ...newPreviewUrls]);
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    const newPreviews = previewUrls.filter((_, i) => i !== index);
    
    URL.revokeObjectURL(previewUrls[index]);
    setImages(newImages);
    setPreviewUrls(newPreviews);
  };

  const uploadImages = async (productId: string) => {
    const uploadedUrls: string[] = [];

    for (let i = 0; i < images.length; i++) {
      const file = images[i];
      const fileExt = file.name.split('.').pop();
      const fileName = `${user?.id}/${productId}/${Date.now()}-${i}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(fileName);

      uploadedUrls.push(publicUrl);
    }

    return uploadedUrls;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please login to list a product",
        variant: "destructive",
      });
      navigate("/auth/login");
      return;
    }

    if (images.length === 0) {
      toast({
        title: "Images required",
        description: "Please upload at least one image",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      // Create product first to get ID
      const { data: product, error: productError } = await supabase
        .from('products')
        .insert([{
          seller_id: user.id,
          title: formData.title,
          description: formData.description || null,
          category: formData.category,
          brand: formData.brand || null,
          size: formData.size || null,
          color: formData.color || null,
          gender: formData.gender || null,
          condition: formData.condition as any,
          price: formData.is_donation ? 0 : parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          is_donation: formData.is_donation,
          ngo_id: formData.is_donation && formData.ngo_id ? formData.ngo_id : null,
          material: formData.material || null,
          care_instructions: formData.care_instructions || null,
          images: [], // Will update after upload
        }])
        .select()
        .single();

      if (productError) throw productError;

      // Upload images
      const imageUrls = await uploadImages(product.id);

      // Update product with image URLs
      const { error: updateError } = await supabase
        .from('products')
        .update({ images: imageUrls })
        .eq('id', product.id);

      if (updateError) throw updateError;

      toast({
        title: "Product listed successfully!",
        description: "Your product is now available in the shop",
      });

      navigate('/agent');
    } catch (error: any) {
      console.error('Error listing product:', error);
      toast({
        title: "Error listing product",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-4xl">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl">List Your Product</CardTitle>
              <p className="text-muted-foreground">
                Fill in the details to sell or donate your fashion item
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Image Upload */}
                <div className="space-y-2">
                  <Label>Product Images (Max 5)</Label>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {previewUrls.map((url, index) => (
                      <div key={index} className="relative aspect-square rounded-lg overflow-hidden border">
                        <img src={url} alt={`Preview ${index + 1}`} className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-2 right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                    
                    {images.length < 5 && (
                      <label className="aspect-square rounded-lg border-2 border-dashed border-border hover:border-primary cursor-pointer flex flex-col items-center justify-center transition-colors">
                        <Upload className="h-8 w-8 text-muted-foreground mb-2" />
                        <span className="text-sm text-muted-foreground">Upload Image</span>
                        <input
                          type="file"
                          accept="image/*"
                          multiple
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      required
                      value={formData.title}
                      onChange={(e) => setFormData({...formData, title: e.target.value})}
                      placeholder="e.g., Vintage Denim Jacket"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Category *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({...formData, category: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="tops">Tops</SelectItem>
                        <SelectItem value="bottoms">Bottoms</SelectItem>
                        <SelectItem value="dresses">Dresses</SelectItem>
                        <SelectItem value="outerwear">Outerwear</SelectItem>
                        <SelectItem value="shoes">Shoes</SelectItem>
                        <SelectItem value="accessories">Accessories</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe your item's condition, features, and style..."
                    rows={4}
                  />
                </div>

                {/* Product Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="brand">Brand</Label>
                    <Input
                      id="brand"
                      value={formData.brand}
                      onChange={(e) => setFormData({...formData, brand: e.target.value})}
                      placeholder="e.g., Levi's"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="size">Size</Label>
                    <Input
                      id="size"
                      value={formData.size}
                      onChange={(e) => setFormData({...formData, size: e.target.value})}
                      placeholder="e.g., M, L, XL"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="color">Color</Label>
                    <Input
                      id="color"
                      value={formData.color}
                      onChange={(e) => setFormData({...formData, color: e.target.value})}
                      placeholder="e.g., Blue, Red"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select
                      value={formData.gender}
                      onValueChange={(value) => setFormData({...formData, gender: value})}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="unisex">Unisex</SelectItem>
                        <SelectItem value="men">Men</SelectItem>
                        <SelectItem value="women">Women</SelectItem>
                        <SelectItem value="kids">Kids</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="condition">Condition *</Label>
                    <Select
                      value={formData.condition}
                      onValueChange={(value) => setFormData({...formData, condition: value})}
                      required
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select condition" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="new">New</SelectItem>
                        <SelectItem value="like_new">Like New</SelectItem>
                        <SelectItem value="good">Good</SelectItem>
                        <SelectItem value="fair">Fair</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Pricing */}
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      id="donation"
                      checked={formData.is_donation}
                      onCheckedChange={(checked) => setFormData({...formData, is_donation: checked as boolean})}
                    />
                    <Label htmlFor="donation" className="cursor-pointer">
                      Donate this item (free for recipient)
                    </Label>
                  </div>

                  {formData.is_donation && (
                    <div className="space-y-2">
                      <Label htmlFor="ngo">Select NGO *</Label>
                      <Select
                        value={formData.ngo_id}
                        onValueChange={(value) => setFormData({...formData, ngo_id: value})}
                        required={formData.is_donation}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Choose an NGO to donate to" />
                        </SelectTrigger>
                        <SelectContent>
                          {ngos.map((ngo) => (
                            <SelectItem key={ngo.id} value={ngo.id}>
                              {ngo.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <p className="text-sm text-muted-foreground">
                        Your item will be donated to this NGO
                      </p>
                    </div>
                  )}

                  {!formData.is_donation && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₹) *</Label>
                        <Input
                          id="price"
                          type="number"
                          required={!formData.is_donation}
                          value={formData.price}
                          onChange={(e) => setFormData({...formData, price: e.target.value})}
                          placeholder="e.g., 1299"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="original_price">Original Price (₹)</Label>
                        <Input
                          id="original_price"
                          type="number"
                          value={formData.original_price}
                          onChange={(e) => setFormData({...formData, original_price: e.target.value})}
                          placeholder="e.g., 2499"
                        />
                      </div>
                    </div>
                  )}
                </div>

                {/* Additional Details */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="material">Material</Label>
                    <Input
                      id="material"
                      value={formData.material}
                      onChange={(e) => setFormData({...formData, material: e.target.value})}
                      placeholder="e.g., 100% Cotton"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="care">Care Instructions</Label>
                    <Input
                      id="care"
                      value={formData.care_instructions}
                      onChange={(e) => setFormData({...formData, care_instructions: e.target.value})}
                      placeholder="e.g., Machine wash cold"
                    />
                  </div>
                </div>

                <div className="flex gap-4">
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Listing Product...
                      </>
                    ) : (
                      'List Product'
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate('/agent')}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

export default ListProduct;