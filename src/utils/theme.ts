type Theme = 'light' | 'dark';

const THEME_KEY = 'color-theme';
const TRANSITION_CLASS = 'theme-transition';
const TRANSITION_DURATION = 150; // milliseconds

export const theme = {
  get: (): Theme => {
    if (typeof window === 'undefined') return 'light';
    
    const stored = localStorage.getItem(THEME_KEY);
    if (stored === 'dark' || stored === 'light') return stored;
    
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  },

  set: (theme: Theme): void => {
    localStorage.setItem(THEME_KEY, theme);
    
    // Add transition class before changing theme
    document.documentElement.classList.add(TRANSITION_CLASS);
    
    // Apply theme change
    requestAnimationFrame(() => {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      
      // Remove transition class after animation completes
      setTimeout(() => {
        document.documentElement.classList.remove(TRANSITION_CLASS);
      }, TRANSITION_DURATION);
    });
  },

  toggle: (): Theme => {
    const current = theme.get();
    const newTheme = current === 'light' ? 'dark' : 'light';
    theme.set(newTheme);
    return newTheme;
  }
};