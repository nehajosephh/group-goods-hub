import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { LoadingSpinner } from '@/components/ui/loading-spinner'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { MapPin, Star, Filter, Search, Package, TrendingUp, ArrowLeft } from 'lucide-react'
import Header from '@/components/layout/Header'
import { useAuth } from '@/contexts/AuthContext'

const ProductCatalog = () => {
  const [products, setProducts] = useState([])
  const [vendors, setVendors] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedLocation, setSelectedLocation] = useState('all')
  const [sortBy, setSortBy] = useState('price_low')
  const [userLocation, setUserLocation] = useState(null)
  const navigate = useNavigate()
  const { toast } = useToast()
  const { user, userRole, signOut } = useAuth()

  useEffect(() => {
    loadData()
    getUserLocation()
  }, [])

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
          // Default to Mumbai coordinates if location is denied
          setUserLocation({
            latitude: 19.0760,
            longitude: 72.8777
          })
        }
      )
    } else {
      // Default location if geolocation is not supported
      setUserLocation({
        latitude: 19.0760,
        longitude: 72.8777
      })
    }
  }

  const loadData = async () => {
    setLoading(true)
    try {
      const [productsResult, vendorsResult] = await Promise.all([
        supabase
          .from('products')
          .select(`
            *,
            vendors(name, location, rating, latitude, longitude)
          `)
          .eq('in_stock', true),
        supabase
          .from('vendors')
          .select('*')
      ])

      if (productsResult.error) throw productsResult.error
      if (vendorsResult.error) throw vendorsResult.error

      setProducts(productsResult.data || [])
      setVendors(vendorsResult.data || [])
    } catch (error) {
      console.error('Error loading data:', error)
      toast({
        title: "Error loading catalog",
        description: "Failed to load products and vendors",
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

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory
    const matchesLocation = selectedLocation === 'all' || 
                           product.vendors?.location.includes(selectedLocation)
    
    return matchesSearch && matchesCategory && matchesLocation
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case 'price_low':
        return a.price - b.price
      case 'price_high':
        return b.price - a.price
      case 'rating':
        return (b.vendors?.rating || 0) - (a.vendors?.rating || 0)
      case 'distance':
        if (!userLocation) return 0
        const distA = calculateDistance(a.vendors?.latitude, a.vendors?.longitude)
        const distB = calculateDistance(b.vendors?.latitude, b.vendors?.longitude)
        if (distA === 'N/A') return 1
        if (distB === 'N/A') return -1
        return parseFloat(distA) - parseFloat(distB)
      default:
        return 0
    }
  })

  const categories = [...new Set(products.map(p => p.category))]
  const locations = [...new Set(vendors.map(v => v.location?.split(',')[0]).filter(Boolean))]

  const handleProductClick = (productId) => {
    navigate(`/product/${productId}`)
  }

  const handleLogout = async () => {
    await signOut()
    navigate('/')
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
          onClick={() => navigate('/')}
          className="mb-6"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Dashboard
        </Button>

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Product Catalog</h1>
          <p className="text-muted-foreground">
            Discover products from verified vendors in your area
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="h-5 w-5" />
              Filter & Search
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search Products</label>
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
              
              <div>
                <label className="text-sm font-medium mb-2 block">Category</label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Location</label>
                <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                  <SelectTrigger>
                    <SelectValue placeholder="All Locations" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Locations</SelectItem>
                    {locations.map(location => (
                      <SelectItem key={location} value={location}>{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="text-sm font-medium mb-2 block">Sort By</label>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="price_low">Price: Low to High</SelectItem>
                    <SelectItem value="price_high">Price: High to Low</SelectItem>
                    <SelectItem value="rating">Rating</SelectItem>
                    <SelectItem value="distance">Distance</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-end">
                <Button onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory('all')
                  setSelectedLocation('all')
                  setSortBy('price_low')
                }} variant="outline" className="w-full">
                  Reset Filters
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Results */}
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground">
            {filteredProducts.length} products found
          </p>
          {userLocation && (
            <p className="text-sm text-muted-foreground flex items-center gap-1">
              <MapPin className="h-4 w-4" />
              Showing distances from your location
            </p>
          )}
        </div>

        {loading ? (
          <div className="text-center py-12">
            <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
            <p>Loading products...</p>
          </div>
        ) : sortedProducts.length === 0 ? (
          <Card className="text-center py-12">
            <CardContent>
              <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-lg font-medium mb-2">No products found</h3>
              <p className="text-muted-foreground">
                Try adjusting your filters to see more results
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedProducts.map((product) => (
              <Card key={product.id} className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader onClick={() => handleProductClick(product.id)}>
                  <div className="flex items-start justify-between mb-2">
                    <Badge variant="secondary">{product.category}</Badge>
                    <div className="flex items-center gap-1 text-sm">
                      <Star className="h-4 w-4 fill-current text-yellow-500" />
                      {product.vendors?.rating || 'N/A'}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <CardDescription>{product.description}</CardDescription>
                </CardHeader>
                <CardContent onClick={() => handleProductClick(product.id)}>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-2xl font-bold text-primary">
                        ₹{product.price.toLocaleString()}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {product.unit}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <MapPin className="h-4 w-4" />
                      <span>{product.vendors?.location}</span>
                      <span className="text-primary font-medium">
                        {calculateDistance(product.vendors?.latitude, product.vendors?.longitude)}
                      </span>
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Vendor:</span> {product.vendors?.name}
                    </div>
                    
                    <div className="text-sm">
                      <span className="font-medium">Min Order:</span> {product.min_order} {product.unit}
                    </div>
                    
                    <Button className="w-full">
                      View Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductCatalog