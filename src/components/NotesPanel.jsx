import React, { useState } from 'react';
import { Plus, StickyNote, User, Map, Zap, Trash2, Edit3 } from 'lucide-react';

export default function NotesPanel({ 
  notes, 
  onAddNote, 
  onUpdateNote, 
  onDeleteNote, 
  darkMode 
}) {
  const [newNote, setNewNote] = useState('');
  const [newNoteType, setNewNoteType] = useState('general');
  const [editingNote, setEditingNote] = useState(null);
  const [editContent, setEditContent] = useState('');

  const handleAddNote = () => {
    if (newNote.trim()) {
      onAddNote({
        content: newNote.trim(),
        type: newNoteType,
      });
      setNewNote('');
    }
  };

  const handleStartEdit = (note) => {
    setEditingNote(note.id);
    setEditContent(note.content);
  };

  const handleSaveEdit = () => {
    if (editingNote && editContent.trim()) {
      onUpdateNote(editingNote, editContent.trim());
      setEditingNote(null);
      setEditContent('');
    }
  };

  const handleCancelEdit = () => {
    setEditingNote(null);
    setEditContent('');
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'character':
        return User;
      case 'plot':
        return Zap;
      case 'setting':
        return Map;
      default:
        return StickyNote;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'character':
        return darkMode ? 'text-blue-400 bg-blue-400/20' : 'text-blue-700 bg-blue-100';
      case 'plot':
        return darkMode ? 'text-yellow-400 bg-yellow-400/20' : 'text-yellow-700 bg-yellow-100';
      case 'setting':
        return darkMode ? 'text-green-400 bg-green-400/20' : 'text-green-700 bg-green-100';
      default:
        return darkMode ? 'text-purple-400 bg-purple-400/20' : 'text-purple-700 bg-purple-100';
    }
  };

  const noteTypes = [
    { value: 'general', label: 'General' },
    { value: 'character', label: 'Character' },
    { value: 'plot', label: 'Plot' },
    { value: 'setting', label: 'Setting' },
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className={`text-3xl font-bold mb-2 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Writer's Notes
        </h2>
        <p className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
          Organize your ideas, characters, plots, and world-building notes
        </p>
      </div>

      <div className={`rounded-xl border p-6 mb-8 ${
        darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
      }`}>
        <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
          Add New Note
        </h3>
        
        <div className="space-y-4">
          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Note Type
            </label>
            <select
              value={newNoteType}
              onChange={(e) => setNewNoteType(e.target.value)}
              className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
              } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
            >
              {noteTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className={`block text-sm font-medium mb-2 ${
              darkMode ? 'text-gray-300' : 'text-gray-700'
            }`}>
              Note Content
            </label>
            <textarea
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="Write your note here..."
              rows={4}
              className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 resize-none ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
            />
          </div>

          <button
            onClick={handleAddNote}
            disabled={!newNote.trim()}
            className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Plus className="h-4 w-4" />
            <span>Add Note</span>
          </button>
        </div>
      </div>

      {notes.length === 0 ? (
        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <StickyNote className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">No notes yet</h3>
          <p className="text-sm">Start adding notes to organize your story ideas</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.map((note) => {
            const TypeIcon = getTypeIcon(note.type);
            const isEditing = editingNote === note.id;

            return (
              <div
                key={note.id}
                className={`group border rounded-xl p-6 transition-all duration-200 ${
                  darkMode
                    ? 'bg-gray-800 border-gray-700'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`inline-flex items-center space-x-2 px-2.5 py-1 rounded-full text-xs font-medium capitalize ${
                    getTypeColor(note.type)
                  }`}>
                    <TypeIcon className="h-3 w-3" />
                    <span>{note.type}</span>
                  </div>
                  
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <button
                      onClick={() => handleStartEdit(note)}
                      className={`p-1 rounded transition-colors ${
                        darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                      }`}
                    >
                      <Edit3 className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => onDeleteNote(note.id)}
                      className="p-1 rounded text-red-500 hover:text-red-600 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>

                {isEditing ? (
                  <div className="space-y-3">
                    <textarea
                      value={editContent}
                      onChange={(e) => setEditContent(e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 resize-none ${
                        darkMode
                          ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                          : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                      } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
                    />
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={handleSaveEdit}
                        className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-sm rounded transition-colors"
                      >
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className={`px-3 py-1 text-sm rounded transition-colors ${
                          darkMode 
                            ? 'bg-gray-700 text-gray-300 hover:bg-gray-600' 
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className={`text-sm whitespace-pre-wrap ${
                      darkMode ? 'text-gray-300' : 'text-gray-700'
                    }`}>
                      {note.content}
                    </p>
                    <div className={`text-xs mt-4 ${
                      darkMode ? 'text-gray-500' : 'text-gray-400'
                    }`}>
                      {new Date(note.createdAt).toLocaleDateString()}
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}