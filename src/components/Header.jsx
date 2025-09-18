import React from 'react';
import { BookOpen, PenTool, Lightbulb, Moon, Sun } from 'lucide-react';

export default function Header({ darkMode, setDarkMode, currentView, setCurrentView }) {
  const navItems = [
    { id: 'library', label: 'Library', icon: BookOpen },
    { id: 'editor', label: 'Editor', icon: PenTool },
    { id: 'notes', label: 'Notes', icon: Lightbulb },
  ];

  return (
    <header className={`sticky top-0 z-50 border-b transition-colors duration-200 ${
      darkMode ? 'bg-gray-900/95 border-gray-800' : 'bg-white/95 border-gray-200'
    } backdrop-blur-sm`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-3">
            <div className={`p-2 rounded-lg ${
              darkMode ? 'bg-purple-500/20' : 'bg-purple-100'
            }`}>
              <BookOpen className="h-6 w-6 text-purple-600" />
            </div>
            <h1 className={`text-xl font-bold ${
              darkMode ? 'text-white' : 'text-gray-900'
            }`}>
              StoryForge
            </h1>
          </div>

          <nav className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setCurrentView(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                    currentView === item.id
                      ? darkMode
                        ? 'bg-purple-500/20 text-purple-400'
                        : 'bg-purple-100 text-purple-700'
                      : darkMode
                        ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                        : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className={`p-2 rounded-lg transition-colors duration-200 ${
              darkMode
                ? 'text-gray-300 hover:text-white hover:bg-gray-800'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            }`}
          >
            {darkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </header>
  );
}