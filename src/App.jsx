import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPages from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import TopUpPage from './pages/TopUpPage';
import SuccessPage from './pages/SuccessPage';

function App() {
  const [transactionData, setTransactionData] = useState(null);

  const handleNavigation = (page, data) => {
    if (data) {
      setTransactionData(data);
    }

  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/auth" replace />} />
        <Route path="/auth" element={<AuthPages />} />
        <Route path="/payment" element={
          <PaymentPage 
            onNavigate={handleNavigation}
          />
        } />
        <Route path="/topup" element={
          <TopUpPage 
            onNavigate={handleNavigation}
          />
        } />
        <Route path="/success" element={
          <SuccessPage 
            {...transactionData}
          />
        } />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
export default App;