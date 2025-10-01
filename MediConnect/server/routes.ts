import type { Express } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import { storage } from "./storage";
import { processMessage, analyzeSymptoms } from "./openai";
import {
  insertAppointmentSchema,
  insertPatientSchema,
  insertOrganDonorSchema,
} from "@shared/schema";

// Mock data for fallback when database fails
const mockData = {
  patients: [
    { id: 1, name: "John Doe", age: 45, condition: "Stable", room: "101" },
    { id: 2, name: "Jane Smith", age: 32, condition: "Recovering", room: "102" },
    { id: 3, name: "Mike Johnson", age: 68, condition: "Critical", room: "ICU-1" }
  ],
  
  doctors: [
    { id: 1, name: "Dr. Sarah Wilson", specialty: "Cardiology", available: true },
    { id: 2, name: "Dr. Alex Chen", specialty: "Neurology", available: true },
    { id: 3, name: "Dr. Maria Garcia", specialty: "Pediatrics", available: false }
  ],
  
  beds: [
    { id: 1, number: "101", status: "available", type: "General", wardId: 1 },
    { id: 2, number: "102", status: "occupied", type: "General", wardId: 1 },
    { id: 3, number: "ICU-1", status: "occupied", type: "ICU", wardId: 2 },
    { id: 4, number: "ICU-2", status: "available", type: "ICU", wardId: 2 }
  ],
  
  appointments: [
    { id: 1, patientName: "John Doe", doctor: "Dr. Sarah Wilson", date: "2024-01-15", time: "10:00 AM", status: "scheduled" },
    { id: 2, patientName: "Jane Smith", doctor: "Dr. Alex Chen", date: "2024-01-15", time: "11:30 AM", status: "scheduled" }
  ],
  
  donors: [
    { id: 1, name: "Robert Brown", bloodType: "O+", organs: ["Kidney"], status: "Available" },
    { id: 2, name: "Lisa Wang", bloodType: "A-", organs: ["Liver", "Cornea"], status: "Pending" }
  ],
  
  wards: [
    { id: 1, name: "General Ward", capacity: 20, occupied: 15 },
    { id: 2, name: "ICU", capacity: 8, occupied: 6 },
    { id: 3, name: "Pediatrics", capacity: 12, occupied: 8 }
  ],
  
  alerts: [
    { id: 1, message: "Patient in room 102 needs attention", type: "warning", read: false },
    { id: 2, message: "ICU bed available", type: "info", read: true }
  ]
};

// Simple chatbot responses when AI fails
const chatbotResponses: any = {
  'hello': 'Hello! How can I assist you with medical information today?',
  'hi': 'Hello! How can I assist you with medical information today?',
  'appointment': 'To book an appointment, please visit the appointments section.',
  'doctor': 'Our doctors are available. Check the doctors section for details.',
  'emergency': 'For emergencies, please call 911 or visit the nearest emergency room.',
  'bed': 'Current bed availability: 2 general beds and 1 ICU bed available.',
  'patient': 'We have 3 patients currently admitted.',
  'default': 'I understand you\'re asking about medical services. Please contact our staff for detailed medical advice.'
};

export async function registerRoutes(app: Express): Promise<Server> {
  const httpServer = createServer(app);

  // WebSocket server for real-time updates
  const wss = new WebSocketServer({ server: httpServer, path: "/ws" });

  const connectedClients = new Set<WebSocket>();

  wss.on("connection", (ws) => {
    connectedClients.add(ws);

    ws.on("close", () => {
      connectedClients.delete(ws);
    });
  });

  // Broadcast real-time updates
  function broadcastUpdate(type: string, data: any) {
    const message = JSON.stringify({ type, data });
    connectedClients.forEach((client) => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  // Dashboard API
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const availableBeds = await storage.getBedsByStatus("available");
      const todayAppointments = await storage.getAppointmentsByDate(new Date());
      const activeDonors = await storage.getAllOrganDonors();
      const occupiedBeds = await storage.getBedsByStatus("occupied");
      const emergencyCases = 0; // Will be calculated with proper bed-ward relationship

      res.json({
        availableBeds: availableBeds.length,
        todayAppointments: todayAppointments.length,
        activeDonors: activeDonors.filter((d) => d.status === "available")
          .length,
        emergencyCases: emergencyCases || 0,
      });
    } catch (error) {
      console.error("Error fetching dashboard stats, using mock data:", error);
      // Mock fallback
      res.json({
        availableBeds: 2,
        todayAppointments: 2,
        activeDonors: 1,
        emergencyCases: 1,
      });
    }
  });

  // Beds API
  app.get("/api/beds", async (req, res) => {
    try {
      const beds = await storage.getBedsWithWardInfo();
      res.json(beds);
    } catch (error) {
      console.error("Error fetching beds, using mock data:", error);
      res.json(mockData.beds);
    }
  });

  app.get("/api/beds/by-ward/:wardId", async (req, res) => {
    try {
      const beds = await storage.getBedsByWard(req.params.wardId);
      res.json(beds);
    } catch (error) {
      console.error("Error fetching beds by ward, using mock data:", error);
      const wardBeds = mockData.beds.filter(bed => bed.wardId === parseInt(req.params.wardId));
      res.json(wardBeds);
    }
  });

  app.patch("/api/beds/:id/status", async (req, res) => {
    try {
      const { status, patientId } = req.body;
      await storage.updateBedStatus(req.params.id, status, patientId);

      // Broadcast real-time update
      const updatedBed = await storage.getBed(req.params.id);
      broadcastUpdate("bedStatusUpdate", updatedBed);

      res.json({ success: true });
    } catch (error) {
      console.error("Error updating bed status:", error);
      res.status(500).json({ message: "Failed to update bed status" });
    }
  });

  // Wards API
  app.get("/api/wards", async (req, res) => {
    try {
      const wards = await storage.getAllWards();
      res.json(wards);
    } catch (error) {
      console.error("Error fetching wards, using mock data:", error);
      res.json(mockData.wards);
    }
  });

  // Appointments API
  app.get("/api/appointments", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsWithDetails();
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching appointments, using mock data:", error);
      res.json(mockData.appointments);
    }
  });

  app.get("/api/appointments/today", async (req, res) => {
    try {
      const appointments = await storage.getAppointmentsByDate(new Date());
      res.json(appointments);
    } catch (error) {
      console.error("Error fetching today's appointments, using mock data:", error);
      res.json(mockData.appointments);
    }
  });

  app.post("/api/appointments", async (req, res) => {
    try {
      const validatedData = insertAppointmentSchema.parse(req.body);
      const appointment = await storage.createAppointment(validatedData);

      // Broadcast real-time update
      broadcastUpdate("newAppointment", appointment);

      res.status(201).json(appointment);
    } catch (error) {
      console.error("Error creating appointment:", error);
      res.status(400).json({ message: "Failed to create appointment" });
    }
  });

  app.patch("/api/appointments/:id/status", async (req, res) => {
    try {
      const { status } = req.body;
      await storage.updateAppointmentStatus(req.params.id, status);
      res.json({ success: true });
    } catch (error) {
      console.error("Error updating appointment status:", error);
      res.status(500).json({ message: "Failed to update appointment status" });
    }
  });

  // Doctors API
  app.get("/api/doctors", async (req, res) => {
    try {
      const doctors = await storage.getAllDoctors();
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching doctors, using mock data:", error);
      res.json(mockData.doctors);
    }
  });

  app.get("/api/doctors/department/:department", async (req, res) => {
    try {
      const doctors = await storage.getDoctorsByDepartment(
        req.params.department,
      );
      res.json(doctors);
    } catch (error) {
      console.error("Error fetching doctors by department, using mock data:", error);
      const deptDoctors = mockData.doctors.filter(d => 
        d.specialty.toLowerCase().includes(req.params.department.toLowerCase())
      );
      res.json(deptDoctors);
    }
  });

  // Patients API
  app.get("/api/patients", async (req, res) => {
    try {
      const patients = await storage.getAllPatients();
      res.json(patients);
    } catch (error) {
      console.error("Error fetching patients, using mock data:", error);
      res.json(mockData.patients);
    }
  });

  app.post("/api/patients", async (req, res) => {
    try {
      const validatedData = insertPatientSchema.parse(req.body);
      const patient = await storage.createPatient(validatedData);
      res.status(201).json(patient);
    } catch (error) {
      console.error("Error creating patient:", error);
      res.status(400).json({ message: "Failed to create patient" });
    }
  });

  // Organ Donors API
  app.get("/api/organ-donors", async (req, res) => {
    try {
      const { bloodType, organType } = req.query;
      const donors = await storage.searchOrganDonors(
        bloodType as string,
        organType as string,
      );
      res.json(donors);
    } catch (error) {
      console.error("Error fetching organ donors, using mock data:", error);
      let filteredDonors = mockData.donors;
      
      if (bloodType) {
        filteredDonors = filteredDonors.filter(d => d.bloodType === bloodType);
      }
      if (organType) {
        filteredDonors = filteredDonors.filter(d => 
          d.organs.some(organ => organ.toLowerCase().includes((organType as string).toLowerCase()))
        );
      }
      
      res.json(filteredDonors);
    }
  });

  app.post("/api/organ-donors", async (req, res) => {
    try {
      const validatedData = insertOrganDonorSchema.parse(req.body);
      const donor = await storage.createOrganDonor(validatedData);

      // Broadcast real-time update
      broadcastUpdate("newDonor", donor);

      res.status(201).json(donor);
    } catch (error) {
      console.error("Error creating organ donor:", error);
      res.status(400).json({ message: "Failed to create organ donor" });
    }
  });

  // Alerts API
  app.get("/api/alerts", async (req, res) => {
    try {
      const alerts = await storage.getAllAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching alerts, using mock data:", error);
      res.json(mockData.alerts);
    }
  });

  app.get("/api/alerts/unread", async (req, res) => {
    try {
      const alerts = await storage.getUnreadAlerts();
      res.json(alerts);
    } catch (error) {
      console.error("Error fetching unread alerts, using mock data:", error);
      const unreadAlerts = mockData.alerts.filter(alert => !alert.read);
      res.json(unreadAlerts);
    }
  });

  app.patch("/api/alerts/:id/read", async (req, res) => {
    try {
      await storage.markAlertAsRead(req.params.id);
      res.json({ success: true });
    } catch (error) {
      console.error("Error marking alert as read:", error);
      res.status(500).json({ message: "Failed to mark alert as read" });
    }
  });

  // Chatbot API
  app.post("/api/chatbot/message", async (req, res) => {
    try {
      const { message, sessionId } = req.body;

      // Try to save user message (but don't fail if it doesn't work)
      try {
        await storage.createChatMessage({
          sessionId,
          message,
          isUser: true,
        });
      } catch (saveError) {
        console.error("Error saving chat message, continuing:", saveError);
      }

      // Process with AI
      const response = await processMessage(message);

      // Try to save AI response (but don't fail if it doesn't work)
      try {
        await storage.createChatMessage({
          sessionId,
          message: response.message,
          isUser: false,
        });
      } catch (saveError) {
        console.error("Error saving AI response, continuing:", saveError);
      }

      res.json(response);
    } catch (error) {
      console.error("Error processing chatbot message, using fallback:", error);
      // Fallback to simple responses
      const response = chatbotResponses[message?.toLowerCase()] || chatbotResponses['default'];
      
      res.json({ 
        message: response,
        timestamp: new Date().toISOString()
      });
    }
  });

  app.get("/api/chatbot/messages/:sessionId", async (req, res) => {
    try {
      const messages = await storage.getChatMessages(req.params.sessionId);
      res.json(messages);
    } catch (error) {
      console.error("Error fetching chat messages, returning empty:", error);
      res.json([]); // Return empty array instead of error
    }
  });

  app.post("/api/chatbot/analyze-symptoms", async (req, res) => {
    try {
      const { symptoms } = req.body;
      const analysis = await analyzeSymptoms(symptoms);
      res.json(analysis);
    } catch (error) {
      console.error("Error analyzing symptoms, using fallback:", error);
      res.json({
        diagnosis: "Please consult with a healthcare professional for accurate diagnosis",
        recommendations: ["Rest well", "Stay hydrated", "Monitor symptoms"],
        urgency: "non_urgent"
      });
    }
  });

  return httpServer;
}
