import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";

// Simple page components for testing
function Dashboard() {
  return <div className="p-6"><h1>Dashboard - Loading...</h1></div>;
}
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
