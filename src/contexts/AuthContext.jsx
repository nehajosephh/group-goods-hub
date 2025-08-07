import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/integrations/supabase/client'
import { getCurrentUser, signOut as supabaseSignOut } from '@/lib/supabase'

const AuthContext = createContext({})

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    getCurrentUser().then((user) => {
      setUser(user)
      setLoading(false)
    })

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signOut = async () => {
    const { error } = await supabaseSignOut()
    if (!error) {
      setUser(null)
    }
    return { error }
  }

  const value = {
    user,
    loading,
    signOut,
    isAuthenticated: !!user,
    userRole: user?.user_metadata?.role || 'buyer'
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}