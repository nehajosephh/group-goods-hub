import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { ArrowLeft, ShoppingCart, Package, MapPin, Star } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/contexts/AuthContext'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)
  const [userLocation, setUserLocation] = useState(null)
  const { user, userRole, signOut } = useAuth()
  const { toast } = useToast()

  useEffect(() => {
    loadProduct()
    getUserLocation()
  }, [id])

  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          })
        },
        (error) => {
          console.log('Location access denied:', error)
          setUserLocation({
            latitude: 19.0760,
            longitude: 72.8777
          })
        }
      )
    } else {
      setUserLocation({
        latitude: 19.0760,
        longitude: 72.8777
      })
    }
  }

  const loadProduct = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          vendors(name, location, rating, latitude, longitude)
        `)
        .eq('id', id)
        .single()

      if (error) throw error
      setProduct(data)
    } catch (error) {
      console.error('Error loading product:', error)
      toast({
        title: "Error loading product",
        description: "Failed to load product details",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const calculateDistance = (vendorLat, vendorLon) => {
    if (!userLocation || !vendorLat || !vendorLon) return 'N/A'
    
    const R = 6371 // Earth's radius in km
    const dLat = (vendorLat - userLocation.latitude) * Math.PI / 180
    const dLon = (vendorLon - userLocation.longitude) * Math.PI / 180
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(userLocation.latitude * Math.PI / 180) * Math.cos(vendorLat * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    const distance = R * c
    
    return distance < 1 ? `${(distance * 1000).toFixed(0)}m` : `${distance.toFixed(1)}km`
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          userRole={userRole}
          userName={user ? (user.user_metadata?.business_name || user.email) : 'Demo User'}
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
            <p>Loading product details...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header 
          userRole={userRole}
          userName={user ? (user.user_metadata?.business_name || user.email) : 'Demo User'}
          onLogout={handleLogout}
        />
        <div className="flex items-center justify-center py-20">
          <div className="text-center">
            <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
            <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
            <Button onClick={() => navigate('/catalog')}>Browse Catalog</Button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={userRole}
        userName={user ? (user.user_metadata?.business_name || user.email) : 'Demo User'}
        onLogout={handleLogout}
      />
      
      <div className="container mx-auto px-6 py-8">
        <Button
          variant="ghost"
          onClick={() => navigate(-1)}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </Button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="mb-6">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                  <p className="text-lg text-muted-foreground mb-4">{product.description}</p>
                </div>
                <Badge variant="secondary" className="ml-4">
                  {product.category}
                </Badge>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-primary">₹{product.price}</div>
                    <div className="text-sm text-muted-foreground">{product.unit}</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold">{product.min_order}</div>
                    <div className="text-sm text-muted-foreground">Min order</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold text-success">
                      {product.in_stock ? "✓" : "✗"}
                    </div>
                    <div className="text-sm text-muted-foreground">In Stock</div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl font-bold flex items-center justify-center gap-1">
                      <Star className="h-6 w-6 fill-current text-yellow-500" />
                      {product.vendors?.rating || 'N/A'}
                    </div>
                    <div className="text-sm text-muted-foreground">Rating</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Product Details</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between">
                      <span className="font-medium">Category:</span>
                      <span>{product.category}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Unit:</span>
                      <span>{product.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Minimum Order:</span>
                      <span>{product.min_order} {product.unit}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-medium">Availability:</span>
                      <Badge variant={product.in_stock ? "success" : "destructive"}>
                        {product.in_stock ? "In Stock" : "Out of Stock"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          <div>
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle>Vendor Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <h3 className="font-semibold">{product.vendors?.name}</h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{product.vendors?.location}</span>
                    <span className="text-primary font-medium">
                      {calculateDistance(product.vendors?.latitude, product.vendors?.longitude)}
                    </span>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Star className="h-4 w-4 fill-current text-yellow-500" />
                  <span className="font-medium">{product.vendors?.rating || 'N/A'}</span>
                  <span className="text-sm text-muted-foreground">vendor rating</span>
                </div>
                
                <div className="space-y-2">
                  <Button 
                    className="w-full" 
                    size="lg"
                    onClick={() => navigate(`/cart/create?product=${product.id}`)}
                  >
                    <ShoppingCart className="w-4 h-4 mr-2" />
                    Start New Cart
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => navigate(`/vendor/${product.vendor_id}`)}
                  >
                    View Vendor Profile
                  </Button>
                </div>

                <div className="pt-4 border-t">
                  <h4 className="font-semibold mb-2">Bulk Order Benefits</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• Better pricing on bulk orders</li>
                    <li>• Shared shipping costs</li>
                    <li>• Connect with other buyers</li>
                    <li>• Verified vendor quality</li>
                  </ul>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail