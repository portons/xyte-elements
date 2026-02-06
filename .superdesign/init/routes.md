# Route Mapping

This project currently uses a single-page root route (Vite React app).

## Entry
- URL path: `/`
- Entry file: `src/main.tsx`
- Root page component: `src/App.tsx`

## Router config
No explicit router config yet (no React Router in this initial scaffold).

## Entry file source
```tsx
import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```
