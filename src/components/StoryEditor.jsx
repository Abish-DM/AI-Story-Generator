import React, { useState, useEffect } from 'react';
import { Save, Wand2, ArrowLeft, Download, BookOpen, Clock } from 'lucide-react';
import { generateStory, improveStory } from '../services/geminiAPI';

export default function StoryEditor({ 
  story, 
  onSaveStory, 
  onBack, 
  darkMode,
  storyNotes 
}) {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [notes, setNotes] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [isImproving, setIsImproving] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [showPrompt, setShowPrompt] = useState(false);
  const [status, setStatus] = useState('draft');
  const [lastSaved, setLastSaved] = useState(null);

  useEffect(() => {
    if (story) {
      setTitle(story.title);
      setContent(story.content);
      setNotes(story.notes);
      setStatus(story.status);
    }
  }, [story]);

  useEffect(() => {
    const timer = setTimeout(() => {
      if (title || content || notes) {
        handleSave();
      }
    }, 2000);

    return () => clearTimeout(timer);
  }, [title, content, notes, status]);

  const handleSave = () => {
    const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
    
    onSaveStory({
      id: story?.id,
      title: title || 'Untitled Story',
      content,
      notes,
      status,
      wordCount,
      updatedAt: new Date().toISOString(),
    });
    
    setLastSaved(new Date());
  };

  const handleGenerate = async () => {
    if (!prompt.trim()) return;
    
    setIsGenerating(true);
    try {
      const generatedStory = await generateStory(prompt);
      setContent(generatedStory);
      setPrompt('');
      setShowPrompt(false);
    } catch (error) {
      console.error('Error generating story:', error);
      alert('Failed to generate story. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImprove = async () => {
    if (!content.trim()) return;
    
    setIsImproving(true);
    try {
      const improvedStory = await improveStory(content, notes || storyNotes);
      setContent(improvedStory);
    } catch (error) {
      console.error('Error improving story:', error);
      alert('Failed to improve story. Please try again.');
    } finally {
      setIsImproving(false);
    }
  };

  const handleExport = () => {
    const storyText = `${title}\n\n${content}`;
    const blob = new Blob([storyText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${title || 'story'}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const wordCount = content.trim().split(/\s+/).filter(word => word.length > 0).length;
  const readingTime = Math.ceil(wordCount / 200);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors duration-200 ${
            darkMode
              ? 'text-gray-300 hover:text-white hover:bg-gray-800'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
          }`}
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Library</span>
        </button>

        <div className="flex items-center space-x-3">
          <div className={`text-sm ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
            {lastSaved ? `Saved at ${lastSaved.toLocaleTimeString()}` : 'Auto-saving...'}
          </div>
          
          <button
            onClick={handleSave}
            className="flex items-center space-x-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Save className="h-4 w-4" />
            <span>Save</span>
          </button>

          <button
            onClick={handleExport}
            disabled={!content.trim()}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
          >
            <Download className="h-4 w-4" />
            <span>Export</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        <div className="lg:col-span-3 space-y-6">
          <div className={`rounded-xl border p-6 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <input
              type="text"
              placeholder="Story Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`w-full text-2xl font-bold bg-transparent border-none outline-none placeholder-gray-400 ${
                darkMode ? 'text-white' : 'text-gray-900'
              }`}
            />
          </div>

          <div className={`rounded-xl border p-6 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <div className="flex items-center justify-between mb-4">
              <h3 className={`text-lg font-semibold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
                Story Content
              </h3>
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => setShowPrompt(!showPrompt)}
                  className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-3 py-1.5 rounded-lg transition-colors duration-200"
                >
                  <Wand2 className="h-4 w-4" />
                  <span>Generate</span>
                </button>
                {content.trim() && (
                  <button
                    onClick={handleImprove}
                    disabled={isImproving}
                    className="flex items-center space-x-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white px-3 py-1.5 rounded-lg transition-colors duration-200"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>{isImproving ? 'Improving...' : 'Improve'}</span>
                  </button>
                )}
              </div>
            </div>

            {showPrompt && (
              <div className="mb-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="Describe your story idea... (e.g., 'A mystery about a detective who discovers they can read minds')"
                  rows={3}
                  className="w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
                <div className="flex items-center space-x-2 mt-3">
                  <button
                    onClick={handleGenerate}
                    disabled={isGenerating || !prompt.trim()}
                    className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 disabled:bg-purple-400 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    <Wand2 className="h-4 w-4" />
                    <span>{isGenerating ? 'Generating...' : 'Generate Story'}</span>
                  </button>
                  <button
                    onClick={() => setShowPrompt(false)}
                    className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}

            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="Start writing your story here..."
              rows={20}
              className={`w-full px-4 py-3 border rounded-lg transition-colors duration-200 resize-none font-mono leading-relaxed ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
            />

            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
              <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                <div className="flex items-center space-x-1">
                  <BookOpen className="h-4 w-4" />
                  <span>{wordCount} words</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="h-4 w-4" />
                  <span>{readingTime} min read</span>
                </div>
              </div>
              
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className={`px-3 py-1 border rounded-lg text-sm transition-colors duration-200 ${
                  darkMode
                    ? 'bg-gray-700 border-gray-600 text-white focus:border-purple-500'
                    : 'bg-white border-gray-300 text-gray-900 focus:border-purple-500'
                } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
              >
                <option value="draft">Draft</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </div>

        <div className="lg:col-span-1">
          <div className={`rounded-xl border p-6 sticky top-24 ${
            darkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
          }`}>
            <h3 className={`text-lg font-semibold mb-4 ${darkMode ? 'text-white' : 'text-gray-900'}`}>
              Story Notes
            </h3>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add notes about characters, plot points, ideas..."
              rows={12}
              className={`w-full px-3 py-2 border rounded-lg transition-colors duration-200 resize-none ${
                darkMode
                  ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-purple-500'
                  : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
              } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
            />
          </div>
        </div>
      </div>
    </div>
  );
}