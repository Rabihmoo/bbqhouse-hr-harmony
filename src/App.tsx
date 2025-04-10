
import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import Employees from "./pages/Employees";
import Leaves from "./pages/Leaves";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Contracts from "./pages/Contracts";
import Companies from "./pages/Companies";
import Checklists from "./pages/Checklists";
import Administration from "./pages/Administration";
import NotFound from "./pages/NotFound";
import "./App.css";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "./components/ui/dialog";
import { Input } from "./components/ui/input";
import { Label } from "./components/ui/label";
import { Button } from "./components/ui/button";
import { Toaster } from "./components/ui/toaster";
import { toast } from "sonner";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // Check if already authenticated on load
  useEffect(() => {
    const auth = localStorage.getItem("hr-auth");
    if (auth === "true") {
      setIsAuthenticated(true);
    } else {
      setShowLoginDialog(true);
    }

    // Add event listener for authentication changes in other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === "hr-auth") {
        if (e.newValue === "true") {
          setIsAuthenticated(true);
          setShowLoginDialog(false);
        } else {
          setIsAuthenticated(false);
          setShowLoginDialog(true);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleLogin = () => {
    if (username === "admin" && password === "admin") {
      setIsAuthenticated(true);
      setShowLoginDialog(false);
      localStorage.setItem("hr-auth", "true");
      setError("");
      toast.success("Login successful", {
        description: "Welcome to MYR HR Management"
      });
    } else {
      setError("Invalid credentials. Please try again.");
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem("hr-auth");
    setShowLoginDialog(true);
    toast.info("Logged out successfully");
  };

  // Update the document title
  useEffect(() => {
    document.title = "MYR HR Management";
  }, []);

  return (
    <Router>
      <Dialog open={showLoginDialog} onOpenChange={setShowLoginDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Login to MYR HR Management</DialogTitle>
            <DialogDescription>
              Enter your credentials to access the HR management platform.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="username" className="text-right">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="password" className="text-right">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleLogin();
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter className="sm:justify-end">
            <Button type="button" onClick={handleLogin}>
              Login
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <div className="app w-full">
        <Routes>
          {isAuthenticated ? (
            <>
              <Route path="/" element={<Index onLogout={handleLogout} />} />
              <Route path="/employees" element={<Employees onLogout={handleLogout} />} />
              <Route path="/leaves" element={<Leaves onLogout={handleLogout} />} />
              <Route path="/attendance" element={<Attendance onLogout={handleLogout} />} />
              <Route path="/payroll" element={<Payroll onLogout={handleLogout} />} />
              <Route path="/contracts" element={<Contracts onLogout={handleLogout} />} />
              <Route path="/companies" element={<Companies onLogout={handleLogout} />} />
              <Route path="/checklists" element={<Checklists onLogout={handleLogout} />} />
              <Route path="/administration" element={<Administration onLogout={handleLogout} />} />
              <Route path="*" element={<NotFound />} />
            </>
          ) : (
            <>
              <Route path="*" element={<Navigate to="/" />} />
              <Route path="/" element={<div className="min-h-screen flex items-center justify-center">Loading...</div>} />
            </>
          )}
        </Routes>
      </div>
      <Toaster />
    </Router>
  );
}

export default App;
