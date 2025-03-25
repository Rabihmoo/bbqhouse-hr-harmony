
import React from "react";
import { LogOut, Settings, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useToast } from "@/hooks/use-toast";

const UserProfileMenu = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // This would eventually come from auth context
  const currentUser = {
    initials: "RM",
    name: "Restaurant Manager",
    email: "admin@example.com",
    role: "Administrator"
  };

  const handleSignOut = () => {
    // In a real app, this would call an auth service
    toast({
      title: "Signed out",
      description: "You have been signed out successfully.",
    });
    // Navigate to login page
    // navigate("/login");
  };

  const handleSwitchUser = () => {
    // In a real app, this would show a user selection screen
    toast({
      title: "Switch User",
      description: "User selection screen would appear here.",
    });
  };

  const handleAccountSettings = () => {
    // Navigate to account settings
    navigate("/administration");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button className="w-9 h-9 rounded-full bg-bbqblack flex items-center justify-center text-white font-medium hover:bg-gray-800 transition-colors">
          {currentUser.initials}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium">{currentUser.name}</p>
            <p className="text-xs text-muted-foreground">{currentUser.email}</p>
            <p className="text-xs text-muted-foreground">{currentUser.role}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSwitchUser}>
          <User className="mr-2 h-4 w-4" />
          <span>Switch User</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleAccountSettings}>
          <Settings className="mr-2 h-4 w-4" />
          <span>Account Settings</span>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default UserProfileMenu;
