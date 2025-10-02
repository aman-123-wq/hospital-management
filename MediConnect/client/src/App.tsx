import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import { useState, useEffect } from "react";

// Simple Dashboard component
// Dashboard with Real Data
function Dashboard() {
  const [stats, setStats] = useState({
    totalPatients: 0,
    availableBeds: 0,
    todaysAppointments: 0,
    activeDoctors: 0
  });
  const [loading, setLoading] = useState(true);

  // Fetch real dashboard stats from your API
  useEffect(() => {
    fetch('https://mediconnect-backend-rje5.onrender.com/api/dashboard/stats')
      .then(response => response.json())
      .then(data => {
        setStats(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching dashboard stats:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Total Patients</h3>
          <p className="text-2xl font-bold text-blue-600">{stats.totalPatients}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Available Beds</h3>
          <p className="text-2xl font-bold text-green-600">{stats.availableBeds}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Today's Appointments</h3>
          <p className="text-2xl font-bold text-orange-600">{stats.todaysAppointments}</p>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold mb-2">Active Doctors</h3>
          <p className="text-2xl font-bold text-purple-600">{stats.activeDoctors}</p>
        </div>
      </div>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Hospital Overview</h2>
        <p>Real-time hospital statistics loaded successfully!</p>
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

// Patients Page - REAL DATA VERSION (This WAS working!)
function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mediconnect-backend-rje5.onrender.com/api/patients')
      .then(response => response.json())
      .then(data => {
        setPatients(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching patients:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-bold mb-6">Patients</h1>
        <div className="bg-white p-6 rounded-lg shadow-md">
          <p>Loading patient data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Patients</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Patient List</h2>
        
        {patients.length === 0 ? (
          <p>No patients found.</p>
        ) : (
          <div className="space-y-4">
            {patients.map(patient => (
              <div key={patient.id} className="border-b pb-4">
                <h3 className="font-semibold text-lg">{patient.name}</h3>
                <p>Age: {patient.age} | Condition: {patient.condition}</p>
                <p>Room: {patient.room}</p>
              </div>
            ))}
          </div>
        )}
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

// Chatbot Page
function ChatbotPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Chatbot</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <p>Medical chatbot - Coming soon!</p>
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
          <Route path="/beds" component={Beds} />
          <Route path="/appointments" component={Appointments} />
         <Route path="/organ-donors" component={Donors} />
          <Route path="/donors" component={Donors} />
          <Route path="/organ-donor" component={Donors} />
          <Route path="/doctors" component={Doctors} />
          <Route path="/patients" component={Patients} />
          <Route path="/ai-assistant" component={AiAssistant} />
          <Route path="/chatbot" component={ChatbotPage} />
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
