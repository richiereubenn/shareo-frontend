import React, { useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { SignedIn, SignedOut } from "@clerk/clerk-react";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import PaymentPage from "./pages/PaymentPage";
import TopUpPage from "./pages/TopUpPage";
import SuccessPage from "./pages/SuccessPage";
import ScanReceipt from "./pages/ScanReceipt";
import ReceiptList from "./pages/ReceiptList";
import SelectItem from "./pages/SelectItem";
import PaymentRecap from "./pages/PaymentRecap";
import InvitationCode from "./pages/InvitationCodePage";
import JoinRoom from "./pages/JoinRoomPage";
import QRScanner from "./pages/QRScannerPage";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  const [transactionData, setTransactionData] = useState(null);

  const handleNavigation = (page, data) => {
    if (data) {
      setTransactionData(data);
    }
  };

  return (
    <Routes>
      <Route
        path="/"
        element={
          <SignedOut>
            <AuthPage />
          </SignedOut>
        }
      />
      <Route
        path="/"
        element={
          <SignedIn>
            <ProtectedRoute>
              <Homepage />
            </ProtectedRoute>
          </SignedIn>
        }
      />
      <Route
        path="/payment"
        element={
          <ProtectedRoute>
            <PaymentPage onNavigate={handleNavigation} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/topup"
        element={
          <ProtectedRoute>
            <TopUpPage onNavigate={handleNavigation} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/success"
        element={
          <ProtectedRoute>
            <SuccessPage {...transactionData} />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan-receipt"
        element={
          <ProtectedRoute>
            <ScanReceipt />
          </ProtectedRoute>
        }
      />
      <Route
        path="/receipt-list"
        element={
          <ProtectedRoute>
            <ReceiptList />
          </ProtectedRoute>
        }
      />
      <Route
        path="/select-item"
        element={
          <ProtectedRoute>
            <SelectItem />
          </ProtectedRoute>
        }
      />
      <Route
        path="/payment-recap"
        element={
          <ProtectedRoute>
            <PaymentRecap />
          </ProtectedRoute>
        }
      />
      <Route
        path="/invitation-code"
        element={
          <ProtectedRoute>
            <InvitationCode />
          </ProtectedRoute>
        }
      />
      <Route
        path="/join-room"
        element={
          <ProtectedRoute>
            <JoinRoom />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scan-qr"
        element={
          <ProtectedRoute>
            <QRScanner />
          </ProtectedRoute>
        }
      />

      {/* Redirect if route not found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
