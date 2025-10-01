import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

// Simple Dashboard component (no errors)
function Dashboard() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Available Beds</h3>
          <p className="text-2xl font-bold text-green-600">2</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <p className="text-2xl font-bold text-blue-600">5</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Patients</h3>
          <p className="text-2xl font-bold text-orange-600">12</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Available Doctors</h3>
          <p className="text-2xl font-bold text-purple-600">8</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Recent Activity</h2>
        <p>Hospital management system is running successfully!</p>
      </div>
    </div>
  );
}

// Keep the other simple components for now
function Beds() {
  return <div className="p-6"><h1>Bed Management - Loading...</h1></div>;
}
function Patients() {
  return <div className="p-6"><h1>Patients - Loading...</h1></div>;
}
function Doctors() {
  return <div className="p-6"><h1>Doctors - Loading...</h1></div>;
}
function Appointments() {
  return <div className="p-6"><h1>Appointments - Loading...</h1></div>;
}
function Donors() {
  return <div className="p-6"><h1>Organ Donors - Loading...</h1></div>;
}
function AiAssistant() {
  return <div className="p-6"><h1>AI Assistant - Loading...</h1></div>;
}

function Router() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/dashboard" component={Dashboard} />
          <Route path="/bed-management" component={Beds} />
          <Route path="/appointments" component={Appointments} />
          <Route path="/organ-donors" component={Donors} />
          <Route path="/doctors" component={Doctors} />
          <Route path="/patients" component={Patients} />
          <Route path="/ai-assistant" component={AiAssistant} />
          <Route component={NotFound} />
        </Switch>
      </main>
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
