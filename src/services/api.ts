// ============================================================
// API Service Layer for Mochi - Virtual Teaching Assistant
// ============================================================
// TODO: Connect to Flask backend using psycopg2 adapter for PostgreSQL persistence
//
// Future endpoints:
//   GET    /api/students            — fetch all students
//   PUT    /api/students/:id        — update student health record
//   GET    /api/medication-alerts   — fetch all medication alerts
//   POST   /api/medication-alerts   — create a medication alert
//   PATCH  /api/medication-alerts/:id — update alert status (seen/done)
//   GET    /api/emergency-contacts  — fetch emergency contacts
//
// Example Flask connection (Python):
//   import psycopg2
//   conn = psycopg2.connect(
//       host="localhost",
//       database="mochi_db",
//       user="mochi_user",
//       password="secure_password"
//   )
//
// PostgreSQL Schema:
//   CREATE TABLE students (
//       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       name VARCHAR(100) NOT NULL,
//       parent_phone VARCHAR(20) NOT NULL,
//       class_group VARCHAR(20) NOT NULL,
//       allergies TEXT[] DEFAULT '{}',
//       medicines TEXT[] DEFAULT '{}'
//   );
//
//   CREATE TABLE medication_alerts (
//       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       student_id UUID REFERENCES students(id),
//       student_name VARCHAR(100) NOT NULL,
//       medication VARCHAR(200) NOT NULL,
//       time VARCHAR(10) NOT NULL,
//       instructions TEXT,
//       status VARCHAR(20) DEFAULT 'pending',
//       seen_at TIMESTAMP,
//       done_at TIMESTAMP,
//       created_at TIMESTAMP DEFAULT NOW()
//   );
//
//   CREATE TABLE emergency_contacts (
//       id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
//       name VARCHAR(100) NOT NULL,
//       phone VARCHAR(20) NOT NULL,
//       icon VARCHAR(20) NOT NULL
//   );
// ============================================================

import { Student, MedicationReminder } from "@/Data/mockData";

// Simulated API delay
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

export const api = {
  // Student endpoints (mock)
  async getStudents(): Promise<Student[]> {
    await delay(100);
    // TODO: return fetch("/api/students").then(r => r.json());
    const { students } = await import("@/Data/mockData");
    return students;
  },

  async updateStudent(student: Student): Promise<Student> {
    await delay(100);
    // TODO: return fetch(`/api/students/${student.id}`, { method: "PUT", body: JSON.stringify(student) }).then(r => r.json());
    return student;
  },

  // Medication alert endpoints (mock)
  async getMedicationAlerts(): Promise<MedicationReminder[]> {
    await delay(100);
    // TODO: return fetch("/api/medication-alerts").then(r => r.json());
    const { medicationReminders } = await import("@/Data/mockData");
    return medicationReminders;
  },

  //
};
