import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './styles/index.css';
import App from './app/App.tsx';
import { ToastProvider } from './shared/providers/ToastProvider.tsx';
import { AuthProvider } from './features/auth/providers/AuthProvider';
import { BrowserRouter } from 'react-router-dom';
import { ConnectivityProvider } from './shared/providers/ConnectivityProvider.tsx';
import { registerServiceWorker } from './pwa/registerServiceWorker.ts';

registerServiceWorker();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ConnectivityProvider>
        <ToastProvider>
          <AuthProvider>
            <App />
          </AuthProvider>
        </ToastProvider>
      </ConnectivityProvider>
    </BrowserRouter>
  </StrictMode>
);
