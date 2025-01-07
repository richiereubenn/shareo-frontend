import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

const clerkFrontendApi = 'pk_test_ZnVubnktYXBoaWQtODEuY2xlcmsuYWNjb3VudHMuZGV2JA'; // Ganti dengan frontend API Clerk Anda

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>,
  </StrictMode>
);
