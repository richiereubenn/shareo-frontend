import React, { useState } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import AuthPages from './pages/AuthPage';
import PaymentPage from './pages/PaymentPage';
import TopUpPage from './pages/TopUpPage';
import SuccessPage from './pages/SuccessPage';
import InvitationCode from "./pages/InvitationCodePage";
import JoinRoom from "./pages/JoinRoomPage";
import QRScanner from "./pages/QRScannerPage";
import Homepage from "./pages/Homepage";
import ScanReceipt from './pages/scanReceipt.jsx';
import ReceiptList from './pages/receiptList.jsx';
import SelectItem from './pages/selectItem.jsx';
import PaymentRecap from './pages/paymentRecap.jsx';

function App() {
  const [transactionData, setTransactionData] = useState(null);

  const handleNavigation = (page, data) => {
    if (data) {
      setTransactionData(data);
    }
  }

  return (
    <Routes>
      <Route path="/" element={<Navigate to="/auth" replace />} />
      <Route path="/auth" element={<AuthPages />} />
      <Route path="/payment" element={<PaymentPage onNavigate={handleNavigation} />} />
      <Route path="/topup" element={<TopUpPage onNavigate={handleNavigation} />} />
      <Route path="/success" element={<SuccessPage {...transactionData} />} />
      <Route path="scanReceipt" element={<ScanReceipt />} />
      <Route path="receiptList" element={<ReceiptList />} />
      <Route path="selectItem" element={<SelectItem />} />
      <Route path="paymentRecap" element={<PaymentRecap />} />
      <Route path="/invitation-code" element={<InvitationCode />} />
      <Route path="/join-room" element={<JoinRoom />} />
      <Route path="/scan-qr" element={<QRScanner />} />
      <Route path="" element={<Homepage />} />
    </Routes>
  );
}

export default App;
