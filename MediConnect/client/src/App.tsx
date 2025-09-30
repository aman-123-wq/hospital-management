import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import Beds from "@/pages/beds";
import Appointments from "@/pages/appointments";
import Donors from "@/pages/donors";
import Doctors from "@/pages/doctors";
import Patients from "@/pages/patients";
import ChatbotPage from "@/pages/chatbot";
import AiAssistant from "@/pages/ai-assistant"; // ADD THIS IMPORT
import Sidebar from "@/components/layout/sidebar";

function Router() {
  return (
    <div className="min-h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Switch>
          <Route path="/" component={Dashboard} />
          <Route path="/bed-management" component={Beds} />
          <Route path="/organ-donors" component={Donors} />
          <Route path="/donors" component={Donors} />
          <Route path="/doctors" component={Doctors} />
          <Route path="/patients" component={Patients} />
          <Route path="/chatbot" component={ChatbotPage} />
          <Route path="/ai-assistant" component={AiAssistant} /> {/* ADD THIS LINE */}
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
