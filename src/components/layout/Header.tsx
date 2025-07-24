import { Button } from "@/components/ui/button";
import { ShoppingCart, User, LogOut, Package } from "lucide-react";

interface HeaderProps {
  userRole?: 'buyer' | 'vendor';
  userName?: string;
  onLogout?: () => void;
}

const Header = ({ userRole, userName, onLogout }: HeaderProps) => {
  return (
    <header className="bg-primary text-primary-foreground shadow-lg">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center space-x-2">
            <div className="bg-white/20 p-2 rounded-lg">
              <ShoppingCart className="h-6 w-6" />
            </div>
            <h1 className="text-2xl font-bold">CartPool</h1>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#" className="hover:text-white/80 transition-colors">Dashboard</a>
            {userRole === 'vendor' && (
              <a href="#" className="hover:text-white/80 transition-colors">My Products</a>
            )}
            {userRole === 'buyer' && (
              <a href="#" className="hover:text-white/80 transition-colors">Browse Catalogs</a>
            )}
            <a href="#" className="hover:text-white/80 transition-colors">My Carts</a>
          </nav>

          {/* User Actions */}
          <div className="flex items-center space-x-4">
            {userName ? (
              <>
                <div className="flex items-center space-x-2">
                  <div className="bg-white/20 p-2 rounded-lg">
                    {userRole === 'vendor' ? <Package className="h-4 w-4" /> : <User className="h-4 w-4" />}
                  </div>
                  <span className="font-medium">{userName}</span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={onLogout}
                  className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <div className="space-x-2">
                <Button variant="outline" size="sm" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-primary">
                  Login
                </Button>
                <Button variant="secondary" size="sm">
                  Sign Up
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;