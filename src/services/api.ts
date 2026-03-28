// src/services/api.ts

const API_BASE_URL = 'http://localhost:5000/api';

// Emergency Contacts API
export const emergencyContactsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts`);
    if (!response.ok) throw new Error('Failed to fetch emergency contacts');
    return response.json();
  },

  add: async (contact: any) => {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!response.ok) throw new Error('Failed to add emergency contact');
    return response.json();
  },

  update: async (id: string, contact: any) => {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(contact),
    });
    if (!response.ok) throw new Error('Failed to update emergency contact');
    return response.json();
  },

  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/emergency-contacts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) throw new Error('Failed to delete emergency contact');
    return response.json();
  },
};

// Medications API
export const medicationsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/medications`);
    if (!response.ok) throw new Error('Failed to fetch medications');
    return response.json();
  },

  add: async (medication: any) => {
    const response = await fetch(`${API_BASE_URL}/medications`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(medication),
    });
    if (!response.ok) throw new Error('Failed to add medication');
    return response.json();
  },

  updateStatus: async (medicationId: string, status: 'pending' | 'seen' | 'completed') => {
    const response = await fetch(`${API_BASE_URL}/medications/${medicationId}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) throw new Error('Failed to update medication status');
    return response.json();
  },
};

// Students API - THIS IS WHAT'S MISSING!
export const studentsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/students`);
    if (!response.ok) throw new Error('Failed to fetch students');
    return response.json();
  },

  getHealthRecords: async () => {
    const response = await fetch(`${API_BASE_URL}/students/health-records`);
    if (!response.ok) throw new Error('Failed to fetch student health records');
    return response.json();
  },

  addHealthRecord: async (data: { id: string; allergies: string; medicines: string }) => {
    const response = await fetch(`${API_BASE_URL}/students/health`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to add health record');
    return response.json();
  },

  update: async (id: string, data: any) => {
    const response = await fetch(`${API_BASE_URL}/students/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!response.ok) throw new Error('Failed to update student');
    return response.json();
  },
};

// Classrooms API
export const classroomsAPI = {
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/classrooms`);
    if (!response.ok) throw new Error('Failed to fetch classrooms');
    return response.json();
  },
};