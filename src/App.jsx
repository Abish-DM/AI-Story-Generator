import React, { useState, useEffect } from 'react';
import Header from './components/Header';
import StoryLibrary from './components/StoryLibrary';
import StoryEditor from './components/StoryEditor';
import NotesPanel from './components/NotesPanel';
import { useLocalStorage } from './hooks/useLocalStorage';

function App() {
  const [darkMode, setDarkMode] = useLocalStorage('darkMode', false);
  const [currentView, setCurrentView] = useState('library');
  const [stories, setStories] = useLocalStorage('stories', []);
  const [notes, setNotes] = useLocalStorage('notes', []);
  const [currentStory, setCurrentStory] = useState(null);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const createNewStory = () => {
    const newStory = {
      id: Date.now().toString(),
      title: '',
      content: '',
      notes: '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      wordCount: 0,
      status: 'draft',
    };
    setCurrentStory(newStory);
    setCurrentView('editor');
  };

  const saveStory = (storyData) => {
    const updatedStories = [...stories];
    const existingIndex = updatedStories.findIndex(s => s.id === storyData.id);
    
    if (existingIndex >= 0) {
      updatedStories[existingIndex] = { ...updatedStories[existingIndex], ...storyData };
    } else {
      const newStory = {
        id: storyData.id || Date.now().toString(),
        title: storyData.title || 'Untitled Story',
        content: storyData.content || '',
        notes: storyData.notes || '',
        createdAt: storyData.createdAt || new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        wordCount: storyData.wordCount || 0,
        status: storyData.status || 'draft',
      };
      updatedStories.push(newStory);
    }
    
    setStories(updatedStories);
    if (currentStory) {
      const updatedStory = updatedStories.find(s => s.id === (storyData.id || currentStory.id));
      if (updatedStory) {
        setCurrentStory(updatedStory);
      }
    }
  };

  const selectStory = (story) => {
    setCurrentStory(story);
    setCurrentView('editor');
  };

  const deleteStory = (id) => {
    if (confirm('Are you sure you want to delete this story?')) {
      setStories(stories.filter(s => s.id !== id));
    }
  };

  const addNote = (noteData) => {
    const newNote = {
      ...noteData,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };
    setNotes([...notes, newNote]);
  };

  const updateNote = (id, content) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, content } : note
    ));
  };

  const deleteNote = (id) => {
    if (confirm('Are you sure you want to delete this note?')) {
      setNotes(notes.filter(note => note.id !== id));
    }
  };

  const backToLibrary = () => {
    setCurrentView('library');
    setCurrentStory(null);
  };

  const allNotesText = notes.map(note => `${note.type.toUpperCase()}: ${note.content}`).join('\n\n');

  return (
    <div className={`min-h-screen transition-colors duration-200 ${
      darkMode ? 'bg-gray-900' : 'bg-gray-50'
    }`}>
      <Header
        darkMode={darkMode}
        setDarkMode={setDarkMode}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />

      <main>
        {currentView === 'library' && (
          <StoryLibrary
            stories={stories}
            onNewStory={createNewStory}
            onSelectStory={selectStory}
            onDeleteStory={deleteStory}
            darkMode={darkMode}
          />
        )}

        {currentView === 'editor' && (
          <StoryEditor
            story={currentStory}
            onSaveStory={saveStory}
            onBack={backToLibrary}
            darkMode={darkMode}
            storyNotes={allNotesText}
          />
        )}

        {currentView === 'notes' && (
          <NotesPanel
            notes={notes}
            onAddNote={addNote}
            onUpdateNote={updateNote}
            onDeleteNote={deleteNote}
            darkMode={darkMode}
          />
        )}
      </main>
    </div>
  );
}

export default App;