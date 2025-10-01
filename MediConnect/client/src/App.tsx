import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

// Simple Dashboard component
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

// Bed Management Page
function Beds() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bed Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Bed management system - Real data coming soon!</p>
      </div>
    </div>
  );
}

// Appointments Page
function Appointments() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Appointment scheduling - Real data coming soon!</p>
      </div>
    </div>
  );
}

// Organ Donors Page
function Donors() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Organ Donors</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Organ donor management - Real data coming soon!</p>
      </div>
    </div>
  );
}

// Doctors Page
function Doctors() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctors</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Doctor management - Real data coming soon!</p>
      </div>
    </div>
  );
}

// Patients Page
function Patients() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Patient management - Real data coming soon!</p>
      </div>
    </div>
  );
}

// AI Assistant Page
function AiAssistant() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">AI Assistant</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>AI medical assistant - Coming soon!</p>
      </div>
    </div>
  );
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
