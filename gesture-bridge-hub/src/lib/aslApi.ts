/**
 * ASL Recognition API Service
 * Handles communication with the Node.js backend for sign language recognition
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000';

// Auth token management
let authToken: string | null = localStorage.getItem('auth_token');

export interface PredictionResponse {
  success: boolean;
  prediction?: string;
  confidence?: number;
  top_predictions?: Record<string, number>;
  error?: string;
}

export interface BatchPredictionResponse {
  success: boolean;
  results?: Array<{
    prediction: string | null;
    confidence: number;
    error?: string;
  }>;
  error?: string;
}

export interface LabelsResponse {
  success: boolean;
  labels?: string[];
  error?: string;
}

export interface AuthResponse {
  success: boolean;
  access_token?: string;
  user?: {
    id: number;
    email: string;
    role: string;
    active: boolean;
    blocked: boolean;
  };
  error?: string;
}

// Helper function to get auth headers
function getAuthHeaders(): Record<string, string> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  
  if (authToken) {
    headers['Authorization'] = `Bearer ${authToken}`;
  }
  
  return headers;
}

// Auth functions
export function setAuthToken(token: string | null) {
  authToken = token;
  if (token) {
    localStorage.setItem('auth_token', token);
  } else {
    localStorage.removeItem('auth_token');
  }
}

export function getAuthToken(): string | null {
  return authToken;
}

export async function login(email: string, password: string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    
    if (data.success && data.access_token) {
      setAuthToken(data.access_token);
    }
    
    return data;
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Login failed',
    };
  }
}

export async function register(email: string, password:string): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Register error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Registration failed',
    };
  }
}

export async function getCurrentUser(): Promise<AuthResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
      headers: getAuthHeaders(),
    });

    return await response.json();
  } catch (error) {
    console.error('Get current user error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Failed to get user info',
    };
  }
}

export function logout() {
  setAuthToken(null);
}

/**
 * Check if the API server is healthy and model is loaded
 */
export async function checkHealth(): Promise<{ status: string; model_loaded: boolean }> {
  try {
    const response = await fetch(`${API_BASE_URL}/health`);
    if (!response.ok) {
      throw new Error('API health check failed');
    }
    return await response.json();
  } catch (error) {
    console.error('Health check error:', error);
    throw error;
  }
}

/**
 * Predict ASL sign from a base64 encoded image
 * @param imageBase64 - Base64 encoded image string (with or without data:image prefix)
 */
export async function predictSign(imageBase64: string): Promise<PredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ image: imageBase64 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Prediction failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Prediction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Predict ASL signs from multiple images
 * @param imagesBase64 - Array of base64 encoded image strings
 */
export async function predictBatch(imagesBase64: string[]): Promise<BatchPredictionResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/predict-batch`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ images: imagesBase64 }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Batch prediction failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Batch prediction error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Get all available ASL labels
 */
export async function getLabels(): Promise<LabelsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/labels`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error('Failed to fetch labels');
    }

    return await response.json();
  } catch (error) {
    console.error('Get labels error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Convert a video frame (HTMLVideoElement or canvas) to base64
 * @param source - Video element or canvas
 * @param x - X coordinate for cropping (optional)
 * @param y - Y coordinate for cropping (optional)
 * @param width - Width for cropping (optional)
 * @param height - Height for cropping (optional)
 */
export function videoFrameToBase64(
  source: HTMLVideoElement | HTMLCanvasElement,
  x = 0,
  y = 0,
  width?: number,
  height?: number,
  options?: { mirror?: boolean; format?: 'jpeg' | 'png'; quality?: number }
): string {
  const canvas = document.createElement('canvas');
  const sourceWidth = 'videoWidth' in source ? source.videoWidth : source.width;
  const sourceHeight = 'videoHeight' in source ? source.videoHeight : source.height;

  canvas.width = width || sourceWidth;
  canvas.height = height || sourceHeight;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    throw new Error('Could not get canvas context');
  }

  const mirror = options?.mirror ?? false;
  if (mirror) {
    ctx.save();
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
  }

  if ('videoWidth' in source) {
    // It's a video element
    ctx.drawImage(source, x, y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  } else {
    // It's already a canvas
    ctx.drawImage(source, x, y, canvas.width, canvas.height, 0, 0, canvas.width, canvas.height);
  }

  if (mirror) {
    ctx.restore();
  }

  // Return base64 without the data:image prefix (API expects clean base64)
  const format = options?.format === 'png' ? 'image/png' : 'image/jpeg';
  const quality = options?.quality ?? 0.95;
  return canvas.toDataURL(format, quality).split(',')[1];
}

export interface SaveTranslationResponse {
  success: boolean;
  translation?: {
    id: string;
    text: string;
    word_count: number;
    created_at: string;
  };
  error?: string;
}

/**
 * Save a translated text to the database
 * @param text - The translated text to save
 */
export async function saveTranslation(text: string): Promise<SaveTranslationResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/translations`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ text }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to save translation');
    }

    return await response.json();
  } catch (error) {
    console.error('Save translation error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

export interface GetTranslationsResponse {
  success: boolean;
  translations?: Array<{
    id: string;
    text: string;
    word_count: number;
    created_at: string;
  }>;
  total?: number;
  page?: number;
  page_size?: number;
  error?: string;
}

/**
 * Get saved translations for the current user
 * @param page - Page number (default: 1)
 * @param pageSize - Number of items per page (default: 10)
 */
export async function getTranslations(page: number = 1, pageSize: number = 10): Promise<GetTranslationsResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/translations?page=${page}&page_size=${pageSize}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get translations');
    }

    return await response.json();
  } catch (error) {
    console.error('Get translations error:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

// Lesson and Sign API functions
export interface Lesson {
  id: string;
  title: string;
  slug: string;
  description: string;
  level: string;
  category: string;
  duration_minutes: number;
  signs_count?: number;
  learning_objectives?: string[];
  signs?: Array<{
    letter_or_word: string;
    description: string;
    image_url?: string;
    video_url?: string;
    difficulty: string;
    tips: string[];
    common_mistakes: string[];
  }>;
  practice_exercises?: Array<{
    type: string;
    instruction: string;
    data: any;
  }>;
}

export interface Sign {
  id: string;
  word: string;
  letter?: string;
  category: string;
  difficulty: string;
  description: string;
  instructions: string;
  image_url?: string;
  video_url?: string;
  gif_url?: string;
  hand_shape?: string;
  movement?: string;
  location?: string;
  two_handed: boolean;
  dominant_hand?: string;
  tags: string[];
  synonyms: string[];
  related_signs?: Sign[];
  tips?: string[];
  common_mistakes?: string[];
  cultural_notes?: string;
  usage_examples: string[];
  frequency_score: number;
}

export interface GetLessonsResponse {
  success: boolean;
  lessons?: Lesson[];
  total?: number;
  page?: number;
  page_size?: number;
  error?: string;
}

export interface GetLessonResponse {
  success: boolean;
  lesson?: Lesson;
  error?: string;
}

export interface SearchSignsResponse {
  success: boolean;
  signs?: Sign[];
  total?: number;
  page?: number;
  page_size?: number;
  error?: string;
}

export interface GetSignResponse {
  success: boolean;
  sign?: Sign;
  error?: string;
}

/**
 * Get all lessons with optional filtering
 */
export async function getLessons(params?: {
  level?: string;
  category?: string;
  page?: number;
  page_size?: number;
}): Promise<GetLessonsResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.level) searchParams.append('level', params.level);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());

    const response = await fetch(`${API_BASE_URL}/api/lessons?${searchParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get lessons');
    }

    return await response.json();
  } catch (error) {
    console.error('Get lessons error, falling back to mock data:', error);
    // Fall back to mock data when API is not available
    const { getMockLessons } = await import('./mockAslData');
    return await getMockLessons(params);
  }
}

/**
 * Get a specific lesson by slug
 */
export async function getLesson(slug: string): Promise<GetLessonResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/lessons/${slug}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get lesson');
    }

    return await response.json();
  } catch (error) {
    console.error('Get lesson error, falling back to mock data:', error);
    // Fall back to mock data when API is not available
    const { getMockLesson } = await import('./mockAslData');
    return await getMockLesson(slug);
  }
}

/**
 * Search for signs
 */
export async function searchSigns(params?: {
  q?: string;
  category?: string;
  difficulty?: string;
  page?: number;
  page_size?: number;
}): Promise<SearchSignsResponse> {
  try {
    const searchParams = new URLSearchParams();
    if (params?.q) searchParams.append('q', params.q);
    if (params?.category) searchParams.append('category', params.category);
    if (params?.difficulty) searchParams.append('difficulty', params.difficulty);
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.page_size) searchParams.append('page_size', params.page_size.toString());

    const response = await fetch(`${API_BASE_URL}/api/signs/search?${searchParams}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to search signs');
    }

    return await response.json();
  } catch (error) {
    console.error('Search signs error, falling back to mock data:', error);
    // Fall back to mock data when API is not available
    const { searchMockSigns } = await import('./mockAslData');
    return await searchMockSigns(params);
  }
}

/**
 * Get a specific sign by ID
 */
export async function getSign(id: string): Promise<GetSignResponse> {
  try {
    const response = await fetch(`${API_BASE_URL}/api/signs/${id}`, {
      headers: getAuthHeaders(),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to get sign');
    }

    return await response.json();
  } catch (error) {
    console.error('Get sign error, falling back to mock data:', error);
    // Fall back to mock data when API is not available
    const { getMockSign } = await import('./mockAslData');
    return await getMockSign(id);
  }
}
