
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Employees from "./pages/Employees";
import Contracts from "./pages/Contracts";
import Attendance from "./pages/Attendance";
import Payroll from "./pages/Payroll";
import Leaves from "./pages/Leaves";
import Administration from "./pages/Administration";
import NotFound from "./pages/NotFound";
import { Toaster } from "./components/ui/toaster";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/employees" element={<Employees />} />
          <Route path="/contracts" element={<Contracts />} />
          <Route path="/attendance" element={<Attendance />} />
          <Route path="/payroll" element={<Payroll />} />
          <Route path="/leaves" element={<Leaves />} />
          <Route path="/administration" element={<Administration />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <Toaster />
      </Router>
    </QueryClientProvider>
  );
}

export default App;
