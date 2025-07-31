import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ArrowLeft, ShoppingCart, Package } from 'lucide-react'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Mock product data - in real app would fetch from Supabase
    setTimeout(() => {
      setProduct({
        id: id,
        name: "Premium Copy Paper A4",
        description: "High-quality white copy paper perfect for office use. 80gsm weight with excellent printability and durability.",
        price: 280,
        unit: "per ream",
        min_order: 10,
        category: "Stationery",
        vendor: "PaperPlus Supplies",
        vendor_location: "Mumbai, MH",
        in_stock: true,
        specifications: {
          weight: "80gsm",
          size: "A4 (210x297mm)",
          brightness: "CIE 150",
          opacity: "94%"
        }
      })
      setLoading(false)
    }, 1000)
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
          <p>Loading product details...</p>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Product Not Found</h1>
          <p className="text-muted-foreground mb-4">The product you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/catalog')}>Browse Catalog</Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
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
                    <div className="text-2xl font-bold">⭐</div>
                    <div className="text-sm text-muted-foreground">Rated</div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Product Specifications</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    {Object.entries(product.specifications || {}).map(([key, value]) => (
                      <div key={key} className="flex justify-between">
                        <span className="font-medium capitalize">{key}:</span>
                        <span>{value}</span>
                      </div>
                    ))}
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
                  <h3 className="font-semibold">{product.vendor}</h3>
                  <p className="text-sm text-muted-foreground">{product.vendor_location}</p>
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
                    onClick={() => navigate(`/vendor/${product.vendor_id || 1}`)}
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