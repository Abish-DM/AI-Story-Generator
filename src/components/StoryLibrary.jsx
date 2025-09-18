import React, { useState } from 'react';
import { Plus, Search, BookOpen, Calendar, Clock, MoreVertical, Trash2, Edit3 } from 'lucide-react';

export default function StoryLibrary({ 
  stories, 
  onNewStory, 
  onSelectStory, 
  onDeleteStory, 
  darkMode 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedStory, setSelectedStory] = useState(null);

  const filteredStories = stories.filter(story =>
    story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    story.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getReadingTime = (wordCount) => {
    const wordsPerMinute = 200;
    return Math.ceil(wordCount / wordsPerMinute);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return darkMode ? 'text-green-400 bg-green-400/20' : 'text-green-700 bg-green-100';
      case 'in-progress':
        return darkMode ? 'text-yellow-400 bg-yellow-400/20' : 'text-yellow-700 bg-yellow-100';
      default:
        return darkMode ? 'text-gray-400 bg-gray-400/20' : 'text-gray-700 bg-gray-100';
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <div>
          <h2 className={`text-3xl font-bold ${darkMode ? 'text-white' : 'text-gray-900'}`}>
            Your Stories
          </h2>
          <p className={`text-sm mt-1 ${darkMode ? 'text-gray-400' : 'text-gray-600'}`}>
            {stories.length} {stories.length === 1 ? 'story' : 'stories'}
          </p>
        </div>
        
        <button
          onClick={onNewStory}
          className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg transition-colors duration-200"
        >
          <Plus className="h-4 w-4" />
          <span>New Story</span>
        </button>
      </div>

      <div className="mb-6">
        <div className="relative">
          <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 ${
            darkMode ? 'text-gray-400' : 'text-gray-500'
          }`} />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full pl-10 pr-4 py-2 border rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-purple-500'
                : 'bg-white border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500'
            } focus:ring-2 focus:ring-purple-500/20 focus:outline-none`}
          />
        </div>
      </div>

      {filteredStories.length === 0 ? (
        <div className={`text-center py-16 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
          <BookOpen className="h-16 w-16 mx-auto mb-4 opacity-50" />
          <h3 className="text-lg font-medium mb-2">
            {searchTerm ? 'No stories found' : 'No stories yet'}
          </h3>
          <p className="text-sm">
            {searchTerm 
              ? 'Try adjusting your search terms'
              : 'Create your first story to get started'
            }
          </p>
          {!searchTerm && (
            <button
              onClick={onNewStory}
              className="mt-4 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg transition-colors duration-200"
            >
              Create Story
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className={`group relative border rounded-xl p-6 transition-all duration-200 hover:shadow-lg cursor-pointer ${
                darkMode
                  ? 'bg-gray-800 border-gray-700 hover:border-gray-600'
                  : 'bg-white border-gray-200 hover:border-gray-300'
              }`}
              onClick={() => onSelectStory(story)}
            >
              <div className="flex items-start justify-between mb-4">
                <h3 className={`font-semibold text-lg line-clamp-2 ${
                  darkMode ? 'text-white' : 'text-gray-900'
                }`}>
                  {story.title || 'Untitled Story'}
                </h3>
                <div className="relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedStory(selectedStory === story.id ? null : story.id);
                    }}
                    className={`p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ${
                      darkMode ? 'text-gray-400 hover:text-white' : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    <MoreVertical className="h-4 w-4" />
                  </button>
                  
                  {selectedStory === story.id && (
                    <div className={`absolute right-0 top-8 w-40 py-2 rounded-lg shadow-lg z-10 ${
                      darkMode ? 'bg-gray-900 border-gray-700' : 'bg-white border-gray-200'
                    } border`}>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectStory(story);
                          setSelectedStory(null);
                        }}
                        className={`flex items-center space-x-2 w-full px-4 py-2 text-sm transition-colors ${
                          darkMode ? 'text-gray-300 hover:bg-gray-800' : 'text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <Edit3 className="h-4 w-4" />
                        <span>Edit</span>
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onDeleteStory(story.id);
                          setSelectedStory(null);
                        }}
                        className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-500 hover:bg-red-50 transition-colors"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <p className={`text-sm line-clamp-3 mb-4 ${
                darkMode ? 'text-gray-400' : 'text-gray-600'
              }`}>
                {story.content || 'No content yet...'}
              </p>

              <div className="flex items-center justify-between">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${
                  getStatusColor(story.status)
                }`}>
                  {story.status.replace('-', ' ')}
                </span>
                
                <div className="flex items-center space-x-4 text-xs">
                  <div className={`flex items-center space-x-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <BookOpen className="h-3 w-3" />
                    <span>{story.wordCount} words</span>
                  </div>
                  <div className={`flex items-center space-x-1 ${
                    darkMode ? 'text-gray-400' : 'text-gray-500'
                  }`}>
                    <Clock className="h-3 w-3" />
                    <span>{getReadingTime(story.wordCount)} min</span>
                  </div>
                </div>
              </div>

              <div className={`flex items-center space-x-1 mt-2 text-xs ${
                darkMode ? 'text-gray-500' : 'text-gray-400'
              }`}>
                <Calendar className="h-3 w-3" />
                <span>Updated {new Date(story.updatedAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}