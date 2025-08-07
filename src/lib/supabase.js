import { supabase } from '@/integrations/supabase/client'

// Auth helpers
export const signUp = async (email, password, userData) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: userData
    }
  })
  return { data, error }
}

export const signIn = async (email, password) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password
  })
  return { data, error }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  return { error }
}

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser()
  return user
}

// Database helpers
export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getCarts = async () => {
  const { data, error } = await supabase
    .from('carts')
    .select(`
      *,
      cart_participants(count),
      vendor:vendors(name, location)
    `)
    .order('created_at', { ascending: false })
  return { data, error }
}

export const getVendors = async () => {
  const { data, error } = await supabase
    .from('vendors')
    .select('*')
    .order('rating', { ascending: false })
  return { data, error }
}

export const createCart = async (cartData) => {
  const { data, error } = await supabase
    .from('carts')
    .insert([cartData])
    .select()
  return { data, error }
}

export const joinCart = async (cartId, userId) => {
  const { data, error } = await supabase
    .from('cart_participants')
    .insert([{ cart_id: cartId, user_id: userId }])
    .select()
  return { data, error }
}

export const addProduct = async (productData) => {
  const { data, error } = await supabase
    .from('products')
    .insert([productData])
    .select()
  return { data, error }
}