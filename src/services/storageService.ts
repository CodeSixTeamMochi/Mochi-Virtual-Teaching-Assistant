import { Lesson, LessonFormData, LessonItem } from '@/types/lesson';

// CHANGED: Added the Base API URL (pointing to your Flask app)
const API_URL = 'http://localhost:5000/api';

// Get all lessons
// CHANGED: Now fetches from Backend API instead of localStorage
export const getLessons = async (): Promise<Lesson[]> => {
  const response = await fetch(`${API_URL}/lessons`);
  if (!response.ok) throw new Error('Failed to fetch lessons');
  return response.json();
};

// Get single lesson by ID
// CHANGED: Now fetches a specific ID from the DB
export const getLessonById = async (id: string): Promise<Lesson | undefined> => {
  const response = await fetch(`${API_URL}/lessons/${id}`);
  if (!response.ok) return undefined;
  return response.json();
};

// Create new lesson
// CHANGED: Sends a POST request to save data in Neon
export const createLesson = async (formData: LessonFormData): Promise<Lesson> => {
  const response = await fetch(`${API_URL}/lessons`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) throw new Error('Failed to create lesson');
  return response.json();
};

// Update existing lesson
// CHANGED: Sends a PUT request to the database
export const updateLesson = async (id: string, formData: LessonFormData): Promise<Lesson | undefined> => {
  const response = await fetch(`${API_URL}/lessons/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData),
  });
  if (!response.ok) return undefined;
  return response.json();
};

// Delete lesson
// CHANGED: Sends a DELETE request to remove rows from DB
export const deleteLesson = async (id: string): Promise<boolean> => {
  const response = await fetch(`${API_URL}/lessons/${id}`, {
    method: 'DELETE',
  });
  return response.ok;
};

// Mark lesson as done
// CHANGED: Updates the 'is_completed' column in PostgreSQL
export const markLessonAsDone = async (lessonId: string): Promise<void> => {
  await fetch(`${API_URL}/lessons/${lessonId}/complete`, {
    method: 'PATCH',
  });
};

// Get completed lesson IDs
// CHANGED: Logic is now handled by the 'getLessons' filter on the server side, 
// but we fetch specific IDs if still needed for the UI
export const getCompletedLessonIds = async (): Promise<string[]> => {
  const response = await fetch(`${API_URL}/lessons/completed/ids`);
  if (!response.ok) return [];
  return response.json();
};

// Reset single lesson progress
// CHANGED: Updates database column 'is_completed' back to FALSE
export const resetSingleLessonProgress = async (lessonId: string): Promise<void> => {
  await fetch(`${API_URL}/lessons/${lessonId}/reset`, {
    method: 'PATCH',
  });
};