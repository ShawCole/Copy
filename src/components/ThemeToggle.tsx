import React, { useEffect, useState } from 'react';
import { Sun, Moon } from 'lucide-react';
import { theme } from '../utils/theme';

export function ThemeToggle() {
  const [mounted, setMounted] = useState(false);
  const [isDark, setIsDark] = useState(theme.get() === 'dark');

  useEffect(() => {
    setMounted(true);
    theme.set(theme.get());
  }, []);

  const toggleTheme = () => {
    const newTheme = theme.toggle();
    setIsDark(newTheme === 'dark');
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed top-4 right-4 z-50 p-2 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <Sun className="w-5 h-5 text-yellow-500" />
      ) : (
        <Moon className="w-5 h-5 text-blue-600" />
      )}
    </button>
  );
}