const API_BASE_URL = 'http://127.0.0.1:5000';

// ==========================================
// EMERGENCY CONTACTS API
// ==========================================
export const emergencyContactsAPI = {
  // Get all emergency contacts
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/emergency-contacts`);
    if (!response.ok) {
      throw new Error('Failed to fetch emergency contacts');
    }
    return response.json();
  },

  // Add new emergency contact
  add: async (contact: {
    name: string;
    phone: string;
    type: string;
    icon: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/emergency-contacts`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      throw new Error('Failed to add emergency contact');
    }
    return response.json();
  },

  // Update emergency contact
  update: async (id: string, contact: {
    name: string;
    phone: string;
    type: string;
    icon: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/emergency-contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(contact),
    });
    if (!response.ok) {
      throw new Error('Failed to update emergency contact');
    }
    return response.json();
  },

  // Delete emergency contact
  delete: async (id: string) => {
    const response = await fetch(`${API_BASE_URL}/api/emergency-contacts/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete emergency contact');
    }
    return response.json();
  },
};

// ==========================================
// MEDICATIONS API
// ==========================================
export const medicationsAPI = {
  // Get all medication schedules
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/medications`);
    if (!response.ok) {
      throw new Error('Failed to fetch medications');
    }
    return response.json();
  },

  // Add new medication schedule
  add: async (medication: {
    studentName: string;
    medicationName: string;
    dosage: string;
    time: string;
    notes?: string;
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/medications`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(medication),
    });
    if (!response.ok) {
      throw new Error('Failed to add medication');
    }
    return response.json();
  },

  // Update medication status (pending -> seen -> completed)
  updateStatus: async (scheduleId: string, status: 'pending' | 'seen' | 'completed') => {
    const response = await fetch(`${API_BASE_URL}/api/medications/${scheduleId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ status }),
    });
    if (!response.ok) {
      throw new Error('Failed to update medication status');
    }
    return response.json();
  },
};

// ==========================================
// STUDENTS API
// ==========================================
export const studentsAPI = {
  // Get all students from database
  getAll: async () => {
    const response = await fetch(`${API_BASE_URL}/api/students`);
    if (!response.ok) {
      throw new Error('Failed to fetch students');
    }
    return response.json();
  },

  // Add student health record
  addHealthRecord: async (studentData: {
    id: string;
    name: string;
    parentPhone: string;
    classGroup: string;
    allergies: string[];
    medicines: string[];
  }) => {
    const response = await fetch(`${API_BASE_URL}/api/students/health`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(studentData),
    });
    if (!response.ok) {
      throw new Error('Failed to add health record');
    }
    return response.json();
  },
};