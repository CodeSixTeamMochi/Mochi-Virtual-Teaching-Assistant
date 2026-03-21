// ============================================================
// API Service Layer for Mochi - Virtual Teaching Assistant
// ============================================================

import { Student, MedicationReminder } from "@/Data/mockData";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Student endpoints (mock)
  async getStudents(): Promise<Student[]> {
    await delay(100);
    const { students } = await import("@/Data/mockData");
    return students;
  },

  async updateStudent(student: Student): Promise<Student> {
    await delay(100);
    return student;
  },

  // Medication alert endpoints (mock)
  async getMedicationAlerts(): Promise<MedicationReminder[]> {
    await delay(100);
    const { medicationReminders } = await import("@/Data/mockData");
    return medicationReminders;
  },
};

// --- REAL DATABASE CONNECTIONS ---
const API_BASE_URL = 'http://127.0.0.1:5000';

export const emergencyContactsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/emergency-contacts`);
    if (!response.ok) throw new Error('Failed to fetch contacts');
    return response.json();
  },

  add: async (contact: { name: string; phone: string; type: string; icon: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/emergency-contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!response.ok) throw new Error('Failed to add contact');
    return response.json();
  },

  update: async (id: string, contact: { name: string; phone: string; type: string; icon: string }) => {
    const response = await fetch(`${API_BASE_URL}/api/emergency-contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!response.ok) throw new Error('Failed to update contact');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/emergency-contacts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete contact');
    return response.json();
  },
};

// --- ADDED MISSING APIs BELOW FOR THE STUDENT INFO TEAM ---

export const studentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },
  
  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
  }
};

export const classroomsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/classrooms`);
    if (!response.ok) throw new Error('Failed to fetch classrooms');
    return response.json();
  }
};

export const medicationsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/medications`); 
    if (!response.ok) throw new Error('Failed to fetch medications');
    return response.json();
  },

  add: async (data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add medication');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/api/medications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update medication');
    return response.json();
  },

  // FIXED: Added the missing updateStatus function your frontend is looking for!
  updateStatus: async (id: string, status: string) => {
    const response = await fetch(`${API_BASE_URL}/api/medications/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update medication status');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/medications/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete medication');
    return response.json();
  }
};