
import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-background">
      <div className="text-center max-w-md mx-auto glass p-12 rounded-2xl animate-fadeIn">
        <img 
          src="/lovable-uploads/3b0f2146-354a-4718-b5d4-d20dc1907ba1.png" 
          alt="BBQ House Logo" 
          className="w-28 h-28 mx-auto mb-6" 
        />
        <h1 className="text-5xl font-bold mb-4">404</h1>
        <p className="text-xl text-muted-foreground mb-6">
          Oops! The page you're looking for doesn't exist.
        </p>
        <Button 
          onClick={() => navigate("/")} 
          className="w-full"
          size="lg"
        >
          Return to Dashboard
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
