import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import AuthPages from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import TopUpPage from './pages/TopUpPage';
import SuccessPage from './pages/SuccessPage';
import InvitationCode from "./pages/InvitationCodePage";
import JoinRoom from "./pages/JoinRoomPage";
import QRScanner from "./pages/QRScannerPage";
import Homepage from "./pages/Homepage";
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'

function App() {
  const [transactionData, setTransactionData] = useState(null);

  const handleNavigation = (page, data) => {
    if (data) {
      setTransactionData(data);
    }
  }
  const [count, setCount] = useState(0)
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

    <Route path="" element={<Homepage />} />
    <Route path="/invitation-code" element={<InvitationCode />} />
    <Route path="/join-room" element={<JoinRoom />} />
    <Route path="/scan-qr" element={<QRScanner />} />
    </Routes>
    </BrowserRouter>
  )
};

export default App
