import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { getCarts, getVendors } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { ShoppingCart, Package, Users, TrendingUp, Plus, MapPin } from "lucide-react";

const BuyerDashboard = () => {
  const [carts, setCarts] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { toast } = useToast();

  const mockCarts = [
    {
      id: 1,
      title: "Office Stationery Bulk Order",
      status: "open",
      participants: 3,
      minValue: 5000,
      currentValue: 3200,
      vendor: "PaperPlus Supplies",
      location: "Mumbai, MH"
    },
    {
      id: 2,
      title: "Packaging Materials",
      status: "threshold_met",
      participants: 5,
      minValue: 10000,
      currentValue: 12500,
      vendor: "BoxCraft Industries",
      location: "Delhi, DL"
    }
  ];

  const mockVendors = [
    {
      id: 1,
      name: "TechSupply Hub",
      category: "Electronics",
      location: "Bangalore, KA",
      products: 45,
      rating: 4.8
    },
    {
      id: 2,
      name: "FreshMart Wholesale",
      category: "Groceries",
      location: "Mumbai, MH", 
      products: 120,
      rating: 4.6
    }
  ];

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cartsResult, vendorsResult] = await Promise.all([
        getCarts(),
        getVendors()
      ]);

      // Use real data if available, fallback to mock data
      setCarts(cartsResult.data?.length ? cartsResult.data : mockCarts);
      setVendors(vendorsResult.data?.length ? vendorsResult.data : mockVendors);
    } catch (error) {
      console.error('Error loading data:', error);
      // Use mock data on error
      setCarts(mockCarts);
      setVendors(mockVendors);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCart = () => {
    navigate('/cart/create');
  };

  const handleBrowseCatalogs = () => {
    navigate('/catalog');
  };

  const handleViewCartDetails = (cartId) => {
    navigate(`/cart/${cartId}`);
  };

  const handleBrowseVendor = (vendorId) => {
    navigate(`/vendor/${vendorId}`);
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-accent text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">
              Welcome to Your Procurement Hub
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Join shared carts, collaborate with local businesses, and save on bulk orders
            </p>
            <div className="flex flex-wrap gap-4">
              <Button 
                variant="secondary" 
                size="lg" 
                className="bg-white text-primary hover:bg-white/90"
                onClick={handleCreateCart}
              >
                <Plus className="mr-2 h-5 w-5" />
                Create New Cart
              </Button>
              <Button 
                variant="outline" 
                size="lg" 
                className="border-white/30 text-white hover:bg-white hover:text-primary"
                onClick={handleBrowseCatalogs}
              >
                Browse Catalogs
              </Button>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-6 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-600 text-sm font-medium">Active Carts</p>
                  <p className="text-3xl font-bold text-blue-900">3</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Total Savings</p>
                  <p className="text-3xl font-bold text-green-900">₹24,500</p>
                </div>
                <TrendingUp className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Collaborations</p>
                  <p className="text-3xl font-bold text-purple-900">15</p>
                </div>
                <Users className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Vendors</p>
                  <p className="text-3xl font-bold text-orange-900">8</p>
                </div>
                <Package className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Active Carts */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Active Carts</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <LoadingSpinner className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading carts...</p>
                </div>
              ) : (
                carts.map((cart) => (
                  <Card key={cart.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-lg">{cart.title}</CardTitle>
                          <CardDescription className="flex items-center mt-1">
                            <MapPin className="h-4 w-4 mr-1" />
                            {cart.location}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={cart.status === 'open' ? 'default' : 'secondary'}
                          className={cart.status === 'threshold_met' ? 'bg-success text-success-foreground' : ''}
                        >
                          {cart.status === 'open' ? 'Open' : 'Ready to Order'}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        <div className="flex justify-between text-sm">
                          <span>Vendor: {cart.vendor}</span>
                          <span>{cart.participants} participants</span>
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex justify-between text-sm">
                            <span>Progress: ₹{cart.currentValue.toLocaleString()} / ₹{cart.minValue.toLocaleString()}</span>
                            <span>{Math.round((cart.currentValue / cart.minValue) * 100)}%</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-2">
                            <div 
                              className="bg-primary h-2 rounded-full transition-all"
                              style={{ width: `${Math.min((cart.currentValue / cart.minValue) * 100, 100)}%` }}
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-2">
                          <Button 
                            size="sm" 
                            className="flex-1"
                            onClick={() => handleViewCartDetails(cart.id)}
                          >
                            View Details
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleViewCartDetails(cart.id)}
                          >
                            Add Items
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>

          {/* Vendor Catalogs */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Featured Vendors</h2>
              <Button variant="outline" size="sm">
                Browse All
              </Button>
            </div>
            
            <div className="space-y-4">
              {loading ? (
                <div className="text-center py-8">
                  <LoadingSpinner className="w-6 h-6 mx-auto mb-2" />
                  <p className="text-sm text-muted-foreground">Loading vendors...</p>
                </div>
              ) : (
                vendors.map((vendor) => (
                <Card key={vendor.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{vendor.name}</CardTitle>
                        <CardDescription className="flex items-center mt-1">
                          <MapPin className="h-4 w-4 mr-1" />
                          {vendor.location}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {vendor.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>{vendor.products} products</span>
                        <span>⭐ {vendor.rating}</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button 
                          size="sm" 
                          className="flex-1"
                          onClick={() => handleBrowseVendor(vendor.id)}
                        >
                          Browse Catalog
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={handleCreateCart}
                        >
                          Start Cart
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuyerDashboard;