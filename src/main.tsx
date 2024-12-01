import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import { theme } from './utils/theme';
import './index.css';

// Prevent transitions on initial load
document.documentElement.classList.add('theme-transition-disabled');

// Initialize theme
theme.set(theme.get());

// Remove the transition prevention after a small delay
setTimeout(() => {
  document.documentElement.classList.remove('theme-transition-disabled');
}, 0);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  </StrictMode>
);