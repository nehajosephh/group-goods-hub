import { useState } from "react";
import Header from "@/components/layout/Header";
import AuthPage from "@/components/auth/AuthPage";
import BuyerDashboard from "@/components/dashboard/BuyerDashboard";
import VendorDashboard from "@/components/dashboard/VendorDashboard";

const Index = () => {
  const [user, setUser] = useState(null);

  const handleLogin = (role, name) => {
    setUser({ role, name });
  };

  const handleLogout = () => {
    setUser(null);
  };

  if (!user) {
    return <AuthPage onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Header 
        userRole={user.role}
        userName={user.name}
        onLogout={handleLogout}
      />
      
      {user.role === 'buyer' ? (
        <BuyerDashboard />
      ) : (
        <VendorDashboard />
      )}
    </div>
  );
};

export default Index;
