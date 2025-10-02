import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import Sidebar from "@/components/layout/sidebar";
import { useState, useEffect } from "react";

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

function BedManagement() {
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mediconnect-backend-rje5.onrender.com/api/beds')
      .then(response => response.json())
      .then(data => {
        setBeds(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching beds:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6"><h1 className="text-2xl font-bold mb-6">Bed Management</h1><div className="bg-white p-6 rounded-lg shadow-md"><p>Loading bed data...</p></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Bed Management</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Bed Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {beds.map(bed => (
            <div key={bed.id} className={`p-4 rounded-lg border ${
              bed.status === 'occupied' ? 'bg-red-50 border-red-200' : 
              bed.status === 'available' ? 'bg-green-50 border-green-200' : 
              'bg-yellow-50 border-yellow-200'
            }`}>
              <h3 className="font-semibold">Bed {bed.number}</h3>
              <p>Status: <span className={`font-semibold ${
                bed.status === 'occupied' ? 'text-red-600' : 
                bed.status === 'available' ? 'text-green-600' : 
                'text-yellow-600'
              }`}>{bed.status}</span></p>
              {bed.patient && <p>Patient: {bed.patient}</p>}
              <p>Room: {bed.room}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function Appointments() {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mediconnect-backend-rje5.onrender.com/api/appointments')
      .then(response => response.json())
      .then(data => {
        setAppointments(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching appointments:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6"><h1 className="text-2xl font-bold mb-6">Appointments</h1><div className="bg-white p-6 rounded-lg shadow-md"><p>Loading appointments...</p></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Appointments</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Today's Appointments</h2>
        <div className="space-y-4">
          {appointments.map(appointment => (
            <div key={appointment.id} className="border-b pb-4">
              <h3 className="font-semibold text-lg">{appointment.patientName}</h3>
              <p>Doctor: {appointment.doctorName}</p>
              <p>Time: {appointment.time} | Date: {appointment.date}</p>
              <p>Status: <span className={`font-semibold ${
                appointment.status === 'confirmed' ? 'text-green-600' : 
                appointment.status === 'pending' ? 'text-yellow-600' : 
                'text-red-600'
              }`}>{appointment.status}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function OrganDonors() {
  const [donors, setDonors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mediconnect-backend-rje5.onrender.com/api/donors')
      .then(response => response.json())
      .then(data => {
        setDonors(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching donors:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6"><h1 className="text-2xl font-bold mb-6">Organ Donors</h1><div className="bg-white p-6 rounded-lg shadow-md"><p>Loading donor data...</p></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Organ Donors</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Donor Registry</h2>
        <div className="space-y-4">
          {donors.map(donor => (
            <div key={donor.id} className="border-b pb-4">
              <h3 className="font-semibold text-lg">{donor.name}</h3>
              <p>Age: {donor.age} | Blood Type: {donor.bloodType}</p>
              <p>Organs: {donor.organs.join(', ')}</p>
              <p>Status: <span className={`font-semibold ${
                donor.status === 'available' ? 'text-green-600' : 
                donor.status === 'matched' ? 'text-blue-600' : 
                'text-gray-600'
              }`}>{donor.status}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
function Doctors() {
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://mediconnect-backend-rje5.onrender.com/api/doctors')
      .then(response => response.json())
      .then(data => {
        setDoctors(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching doctors:', error);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-6"><h1 className="text-2xl font-bold mb-6">Doctors</h1><div className="bg-white p-6 rounded-lg shadow-md"><p>Loading doctor data...</p></div></div>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Doctors</h1>
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-xl font-semibold mb-4">Medical Staff</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {doctors.map(doctor => (
            <div key={doctor.id} className="border p-4 rounded-lg">
              <h3 className="font-semibold text-lg">Dr. {doctor.name}</h3>
              <p>Specialization: {doctor.specialization}</p>
              <p>Department: {doctor.department}</p>
              <p>Contact: {doctor.contact}</p>
              <p>Status: <span className={`font-semibold ${
                doctor.status === 'available' ? 'text-green-600' : 
                doctor.status === 'in-surgery' ? 'text-red-600' : 
                'text-yellow-600'
              }`}>{doctor.status}</span></p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
// Patients Page - NEW VERSION (real data)
function Patients() {
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch real patient data from your API
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
          
          {/* BED MANAGEMENT ROUTES - Multiple possible paths */}
          <Route path="/bed-management" component={Beds} />
          <Route path="/beds" component={Beds} />
          
          <Route path="/appointments" component={Appointments} />
          
          {/* ORGAN DONORS ROUTES - Multiple possible paths */}
          <Route path="/organ-donors" component={Donors} />
          <Route path="/donors" component={Donors} />
          <Route path="/organ-donor" component={Donors} />
          
          <Route path="/doctors" component={Doctors} />
          <Route path="/patients" component={Patients} />
          
          {/* AI & CHATBOT ROUTES */}
          <Route path="/ai-assistant" component={AiAssistant} />
          <Route path="/ai" component={AiAssistant} />
          <Route path="/chatbot" component={ChatbotPage} />
          <Route path="/chat" component={ChatbotPage} />
          
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
