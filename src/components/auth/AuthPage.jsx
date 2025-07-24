import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Package, User, Building } from "lucide-react";

const AuthPage = ({ onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [selectedRole, setSelectedRole] = useState('buyer');
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    businessName: '',
    businessType: '',
    location: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock authentication - in real app, this would call Firebase Auth
    onLogin(selectedRole, formData.businessName || 'Demo User');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-primary to-accent">
      <div className="container mx-auto px-6 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center space-x-2 mb-4">
            <div className="bg-white/20 p-3 rounded-lg">
              <ShoppingCart className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-white">CartPool</h1>
          </div>
          <p className="text-xl text-white/90">
            Join the procurement collaboration platform for MSMEs
          </p>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Features Section */}
            <div className="space-y-6">
              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <ShoppingCart className="mr-2 h-5 w-5" />
                    For Buyers
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-white/90">
                    <li>• Create and join shared carts</li>
                    <li>• Browse vendor catalogs</li>
                    <li>• Collaborate with other businesses</li>
                    <li>• Save money on bulk orders</li>
                  </ul>
                </CardContent>
              </Card>

              <Card className="bg-white/10 border-white/20 text-white">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Package className="mr-2 h-5 w-5" />
                    For Vendors
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 text-white/90">
                    <li>• Manage product catalogs</li>
                    <li>• Track buyer requests</li>
                    <li>• Build customer relationships</li>
                    <li>• Increase bulk sales</li>
                  </ul>
                </CardContent>
              </Card>
            </div>

            {/* Auth Form */}
            <Card className="bg-white shadow-xl">
              <CardHeader>
                <div className="flex justify-center space-x-1 mb-4">
                  <Button
                    variant={isLogin ? "default" : "outline"}
                    onClick={() => setIsLogin(true)}
                    size="sm"
                  >
                    Login
                  </Button>
                  <Button
                    variant={!isLogin ? "default" : "outline"}
                    onClick={() => setIsLogin(false)}
                    size="sm"
                  >
                    Sign Up
                  </Button>
                </div>
                <CardTitle>{isLogin ? 'Welcome Back' : 'Join CartPool'}</CardTitle>
                <CardDescription>
                  {isLogin 
                    ? 'Sign in to your account to continue' 
                    : 'Create your account and start collaborating'
                  }
                </CardDescription>
              </CardHeader>
              
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  {/* Role Selection */}
                  {!isLogin && (
                    <div className="space-y-2">
                      <Label>I am a:</Label>
                      <div className="grid grid-cols-2 gap-2">
                        <Button
                          type="button"
                          variant={selectedRole === 'buyer' ? "default" : "outline"}
                          onClick={() => setSelectedRole('buyer')}
                          className="justify-start"
                        >
                          <User className="mr-2 h-4 w-4" />
                          Buyer
                        </Button>
                        <Button
                          type="button"
                          variant={selectedRole === 'vendor' ? "default" : "outline"}
                          onClick={() => setSelectedRole('vendor')}
                          className="justify-start"
                        >
                          <Package className="mr-2 h-4 w-4" />
                          Vendor
                        </Button>
                      </div>
                    </div>
                  )}

                  {/* Business Details */}
                  {!isLogin && (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="businessName">Business Name</Label>
                        <Input
                          id="businessName"
                          placeholder="Your business name"
                          value={formData.businessName}
                          onChange={(e) => setFormData({...formData, businessName: e.target.value})}
                          required
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="businessType">Business Type</Label>
                        <Input
                          id="businessType"
                          placeholder="e.g., Retailer, Wholesaler, Manufacturer"
                          value={formData.businessType}
                          onChange={(e) => setFormData({...formData, businessType: e.target.value})}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="location">Location</Label>
                        <Input
                          id="location"
                          placeholder="City, State"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          required
                        />
                      </div>
                    </div>
                  )}

                  {/* Login Details */}
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="your@business.com"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" size="lg">
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Button>
                </form>

                {/* Demo Access */}
                <div className="mt-6 pt-4 border-t">
                  <p className="text-sm text-muted-foreground text-center mb-3">
                    Quick Demo Access:
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLogin('buyer', 'Demo Buyer')}
                      className="justify-start"
                    >
                      <User className="mr-2 h-4 w-4" />
                      Buyer Demo
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onLogin('vendor', 'Demo Vendor')}
                      className="justify-start"
                    >
                      <Package className="mr-2 h-4 w-4" />
                      Vendor Demo
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;