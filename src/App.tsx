import React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { OpenTrustProvider } from './context/OpenTrustContext';
import { AppRoutes } from './routes/AppRoutes';

export const App: React.FC = () => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <OpenTrustProvider>
          <AppRoutes />
        </OpenTrustProvider>
      </AuthProvider>
    </BrowserRouter>
  );
};

export default App;
