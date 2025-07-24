import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Package, ShoppingCart, TrendingUp, Users, Plus, Eye, Edit, Star } from "lucide-react";

const VendorDashboard = () => {
  const mockProducts = [
    {
      id: 1,
      name: "Premium Copy Paper A4",
      price: 280,
      unit: "per ream",
      minOrder: 10,
      category: "Stationery",
      inCarts: 3,
      totalOrdered: 45
    },
    {
      id: 2,
      name: "Bulk Printing Cartridges",
      price: 1200,
      unit: "per piece",
      minOrder: 5,
      category: "Electronics",
      inCarts: 2,
      totalOrdered: 15
    }
  ];

  const mockCartRequests = [
    {
      id: 1,
      cartTitle: "Office Stationery Bulk Order",
      buyerName: "TechStart Solutions",
      products: ["Premium Copy Paper A4", "Stapler Set"],
      value: 8500,
      participants: 4,
      status: "threshold_met"
    },
    {
      id: 2,
      cartTitle: "Electronics Bundle",
      buyerName: "Digital Crafters",
      products: ["Bulk Printing Cartridges"],
      value: 6000,
      participants: 2,
      status: "open"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary via-primary to-accent text-white py-16">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl">
            <h1 className="text-4xl font-bold mb-4">
              Vendor Dashboard
            </h1>
            <p className="text-xl mb-8 text-white/90">
              Manage your product catalog and track buyer requests
            </p>
            <div className="flex flex-wrap gap-4">
              <Button variant="secondary" size="lg" className="bg-white text-primary hover:bg-white/90">
                <Plus className="mr-2 h-5 w-5" />
                Add New Product
              </Button>
              <Button variant="outline" size="lg" className="border-white/30 text-white hover:bg-white hover:text-primary">
                View Analytics
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
                  <p className="text-blue-600 text-sm font-medium">Total Products</p>
                  <p className="text-3xl font-bold text-blue-900">24</p>
                </div>
                <Package className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-600 text-sm font-medium">Active Carts</p>
                  <p className="text-3xl font-bold text-green-900">8</p>
                </div>
                <ShoppingCart className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-600 text-sm font-medium">Total Revenue</p>
                  <p className="text-3xl font-bold text-purple-900">₹1.2L</p>
                </div>
                <TrendingUp className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-orange-600 text-sm font-medium">Buyer Network</p>
                  <p className="text-3xl font-bold text-orange-900">32</p>
                </div>
                <Users className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Catalog */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">My Products</h2>
              <Button variant="outline" size="sm">
                Manage All
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockProducts.map((product) => (
                <Card key={product.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{product.name}</CardTitle>
                        <CardDescription>
                          ₹{product.price} {product.unit} • Min order: {product.minOrder}
                        </CardDescription>
                      </div>
                      <Badge variant="secondary">
                        {product.category}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between text-sm">
                        <span>In {product.inCarts} active carts</span>
                        <span>{product.totalOrdered} total ordered</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Eye className="h-4 w-4 mr-1" />
                          View
                        </Button>
                        <Button size="sm" variant="outline">
                          <Edit className="h-4 w-4 mr-1" />
                          Edit
                        </Button>
                        <Button size="sm" className="flex-1">
                          View in Carts
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          {/* Cart Requests */}
          <div>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Buyer Requests</h2>
              <Button variant="outline" size="sm">
                View All
              </Button>
            </div>
            
            <div className="space-y-4">
              {mockCartRequests.map((request) => (
                <Card key={request.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{request.cartTitle}</CardTitle>
                        <CardDescription>
                          by {request.buyerName}
                        </CardDescription>
                      </div>
                      <Badge 
                        variant={request.status === 'open' ? 'default' : 'secondary'}
                        className={request.status === 'threshold_met' ? 'bg-success text-success-foreground' : ''}
                      >
                        {request.status === 'open' ? 'Open' : 'Ready'}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="text-sm">
                        <p className="font-medium">Products:</p>
                        <p className="text-muted-foreground">{request.products.join(", ")}</p>
                      </div>
                      
                      <div className="flex justify-between text-sm">
                        <span>Cart Value: ₹{request.value.toLocaleString()}</span>
                        <span>{request.participants} participants</span>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button size="sm" className="flex-1">
                          View Cart Details
                        </Button>
                        <Button variant="outline" size="sm">
                          Contact Buyer
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>
              Manage your vendor profile and catalog efficiently
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Bulk Product Upload</div>
                  <div className="text-sm text-muted-foreground">Import products via CSV</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Update Pricing</div>
                  <div className="text-sm text-muted-foreground">Batch price adjustments</div>
                </div>
              </Button>
              
              <Button variant="outline" className="justify-start h-auto p-4">
                <div className="text-left">
                  <div className="font-semibold">Export Analytics</div>
                  <div className="text-sm text-muted-foreground">Download sales reports</div>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default VendorDashboard;