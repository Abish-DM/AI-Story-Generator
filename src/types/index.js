/**
 * Story object structure
 * @typedef {Object} Story
 * @property {string} id - Unique identifier
 * @property {string} title - Story title
 * @property {string} content - Story content
 * @property {string} notes - Story notes
 * @property {string} createdAt - Creation timestamp (ISO string)
 * @property {string} updatedAt - Last update timestamp (ISO string)
 * @property {number} wordCount - Number of words in the story
 * @property {string} [genre] - Optional genre
 * @property {'draft'|'in-progress'|'completed'} status - Story status
 */

/**
 * Note object structure
 * @typedef {Object} Note
 * @property {string} id - Unique identifier
 * @property {string} content - Note content
 * @property {string} createdAt - Creation timestamp (ISO string)
 * @property {'character'|'plot'|'setting'|'general'} type - Note type
 */

/**
 * Gemini API response structure
 * @typedef {Object} GeminiResponse
 * @property {Array<{content: {parts: Array<{text: string}>}}>} candidates - Response candidates
 */

// Default values for creating new objects
export const DEFAULT_STORY = {
  id: '',
  title: '',
  content: '',
  notes: '',
  createdAt: '',
  updatedAt: '',
  wordCount: 0,
  genre: undefined,
  status: 'draft'
};

export const DEFAULT_NOTE = {
  id: '',
  content: '',
  createdAt: '',
  type: 'general'
};

// Valid enum values
export const STORY_STATUS = {
  DRAFT: 'draft',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

export const NOTE_TYPES = {
  CHARACTER: 'character',
  PLOT: 'plot',
  SETTING: 'setting',
  GENERAL: 'general'
};

// Validation functions
export const isValidStoryStatus = (status) => {
  return Object.values(STORY_STATUS).includes(status);
};

export const isValidNoteType = (type) => {
  return Object.values(NOTE_TYPES).includes(type);
};

// Helper functions for creating objects
export const createStoryObject = (data = {}) => {
  return {
    ...DEFAULT_STORY,
    ...data,
    id: data.id || Date.now().toString(),
    createdAt: data.createdAt || new Date().toISOString(),
    updatedAt: data.updatedAt || new Date().toISOString()
  };
};

export const createNoteObject = (data = {}) => {
  return {
    ...DEFAULT_NOTE,
    ...data,
    id: data.id || Date.now().toString(),
    createdAt: data.createdAt || new Date().toISOString()
  };
};