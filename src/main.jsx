import React, { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import App from './App';
import './index.css';
import { ClerkProvider } from '@clerk/clerk-react';

// const clerkFrontendApi = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;
const clerkFrontendApi = "pk_test_cmVuZXdlZC1qb2V5LTk0LmNsZXJrLmFjY291bnRzLmRldiQ";

if (!clerkFrontendApi) {
  console.log("Error loading Clerk frontend API key on main.jsx");
  throw new Error('Please set your Clerk frontend API key as an environment variable.');
}

const root = createRoot(document.getElementById('root'));

root.render(
  <StrictMode>
    <ClerkProvider publishableKey={clerkFrontendApi} afterSignOutUrl="/" debug={true}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </ClerkProvider>
  </StrictMode>
);
