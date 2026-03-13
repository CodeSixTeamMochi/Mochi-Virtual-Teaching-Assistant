// src/services/aiLessonService.ts
import { createLesson } from './storageService';
import { Lesson, LessonFormData } from '@/types/lesson';

// Point to your Flask backend
const FLASK_API_URL = import.meta.env.VITE_FLASK_API_URL || 'http://localhost:5000';

export interface AIGenerationRequest {
  topic: string;
  itemCount?: number;
  language?: string;
}

export interface AIGenerationResult {
  success: boolean;
  lesson?: Lesson;
  error?: string;
}

export const generateLessonWithAI = async (
  request: AIGenerationRequest
): Promise<AIGenerationResult> => {
  const { topic, itemCount = 5 } = request;

  try {
    const response = await fetch(`${FLASK_API_URL}/api/generate-lesson`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, item_count: itemCount }),
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to generate lesson');
    }

    const lesson: Lesson = {
      id: data.id,
      title: data.title,
      description: data.description,
      coverImage: data.coverImage || '',
      items: data.items.map((item: any) => ({
        id: item.id || '',
        order: item.order || 0,
        name: item.name,
        spokenText: item.spokenText,
        image: item.image || '',
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    return { success: true, lesson };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to generate lesson',
    };
  }
};
