import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { createCart, getProducts } from '@/lib/supabase'
import { useAuth } from '@/contexts/AuthContext'
import { useToast } from '@/hooks/use-toast'
import { ShoppingCart, Package } from 'lucide-react'

const CartCreate = () => {
  const [loading, setLoading] = useState(false)
  const [products, setProducts] = useState([])
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const { toast } = useToast()
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    location: '',
    min_value: '',
    target_participants: '5',
    deadline: ''
  })

  useEffect(() => {
    loadProducts()
    // Pre-fill category if coming from a specific product
    const productId = searchParams.get('product')
    if (productId) {
      // Set category based on selected product
    }
  }, [searchParams])

  const loadProducts = async () => {
    const { data } = await getProducts()
    setProducts(data || [])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to create a cart",
        variant: "destructive"
      })
      return
    }

    setLoading(true)
    try {
      const cartData = {
        ...formData,
        min_value: parseFloat(formData.min_value),
        target_participants: parseInt(formData.target_participants),
        created_by: user.id,
        status: 'open',
        current_value: 0
      }

      const { data, error } = await createCart(cartData)
      if (error) throw error

      toast({
        title: "Cart created successfully!",
        description: "Your collaborative cart is now open for participants"
      })

      navigate(`/cart/${data[0].id}`)
    } catch (error) {
      toast({
        title: "Error creating cart",
        description: error.message,
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-6 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8 text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <div className="bg-primary/10 p-3 rounded-lg">
                <ShoppingCart className="h-8 w-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold">Create New Cart</h1>
            </div>
            <p className="text-muted-foreground">
              Start a collaborative purchasing cart and invite other businesses to join
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Cart Details</CardTitle>
              <CardDescription>
                Fill in the details for your shared procurement cart
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <Label htmlFor="title">Cart Title *</Label>
                  <Input
                    id="title"
                    placeholder="e.g., Office Stationery Bulk Order"
                    value={formData.title}
                    onChange={(e) => handleChange('title', e.target.value)}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Describe what you're looking to purchase..."
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Select onValueChange={(value) => handleChange('category', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="stationery">Stationery</SelectItem>
                        <SelectItem value="electronics">Electronics</SelectItem>
                        <SelectItem value="office-supplies">Office Supplies</SelectItem>
                        <SelectItem value="packaging">Packaging</SelectItem>
                        <SelectItem value="cleaning">Cleaning Supplies</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      placeholder="City, State"
                      value={formData.location}
                      onChange={(e) => handleChange('location', e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="min_value">Minimum Cart Value (₹) *</Label>
                    <Input
                      id="min_value"
                      type="number"
                      placeholder="10000"
                      value={formData.min_value}
                      onChange={(e) => handleChange('min_value', e.target.value)}
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="target_participants">Target Participants</Label>
                    <Select onValueChange={(value) => handleChange('target_participants', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder="5" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="3">3 businesses</SelectItem>
                        <SelectItem value="5">5 businesses</SelectItem>
                        <SelectItem value="10">10 businesses</SelectItem>
                        <SelectItem value="15">15+ businesses</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div>
                  <Label htmlFor="deadline">Deadline (Optional)</Label>
                  <Input
                    id="deadline"
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleChange('deadline', e.target.value)}
                  />
                </div>

                <div className="flex gap-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => navigate(-1)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={loading}
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <LoadingSpinner className="w-4 h-4 mr-2" />
                        Creating...
                      </>
                    ) : (
                      <>
                        <Package className="w-4 h-4 mr-2" />
                        Create Cart
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default CartCreate