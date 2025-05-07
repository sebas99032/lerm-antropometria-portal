
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { LogOut, User } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface HeaderProps {
  title: string;
}

const Header = ({ title }: HeaderProps) => {
  const { currentUser, logout } = useAuth();
  const navigate = useNavigate();
  
  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="bg-lerm-700 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">LERM</h1>
          <h2 className="text-sm">{title}</h2>
        </div>
        
        {currentUser && (
          <div className="flex items-center gap-4">
            <div className="flex items-center">
              <User className="h-4 w-4 mr-1" />
              <span className="text-sm hidden md:inline">{currentUser.name}</span>
              <span className="text-sm text-gray-200 ml-1 hidden md:inline">({currentUser.role})</span>
            </div>
            <Button size="sm" variant="destructive" onClick={handleLogout}>
              <LogOut className="h-4 w-4 mr-1" />
              <span className="hidden md:inline">Cerrar Sesión</span>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
