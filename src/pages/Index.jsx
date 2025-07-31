import { useState } from "react";
import Header from "@/components/layout/Header";
import AuthPage from "@/components/auth/AuthPage";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import VendorDashboard from "@/components/dashboard/VendorDashboard";
import { useAuth } from "@/contexts/AuthContext";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Index = () => {
  const { user, loading, signOut, userRole } = useAuth();
  const [localUser, setLocalUser] = useState(null);

  const handleLogin = (role, name) => {
    setLocalUser({ role, name });
  };

  const handleLogout = async () => {
    if (user) {
      await signOut();
    } else {
      setLocalUser(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <LoadingSpinner className="w-8 h-8 mx-auto mb-4" />
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!user && !localUser) {
    return <AuthPage onLogin={handleLogin} />;
  }

  const currentUser = user || localUser;
  const currentRole = user ? userRole : currentUser.role;
  const currentName = user ? (user.user_metadata?.business_name || user.email) : currentUser.name;

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={currentRole}
        userName={currentName}
        onLogout={handleLogout}
      />
      
      {currentRole === 'buyer' ? (
        <BuyerDashboard />
      ) : (
        <VendorDashboard />
      )}
    </div>
  );
};

export default Index;
