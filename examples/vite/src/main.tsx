import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'sloyka/styles.css';
import './site.css';
import { ThemeProvider, ToastProvider } from 'sloyka';
import { AdminApp } from './AdminApp';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <ToastProvider>
        <AdminApp />
      </ToastProvider>
    </ThemeProvider>
  </StrictMode>,
);
