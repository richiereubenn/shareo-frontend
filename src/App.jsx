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
import { useUser } from "@clerk/clerk-react";

function App() {

  const { isSignedIn, user, isLoaded } = useUser()
  if (isSignedIn) {
    console.log(user.firstName)
  }

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
          <>
            <SignedOut>
              <AuthPage />
            </SignedOut>
            <SignedIn>
              <Homepage />
            </SignedIn>
          </>
        }
      />
      {/* <Route
        path="/home"
        element={
          <SignedIn>
            <Homepage />
          </SignedIn>
        }
      /> */}
      <Route
        path="/payment"
        element={
          <SignedIn>
            <PaymentPage onNavigate={handleNavigation} />
          </SignedIn>
        }
      />
      <Route
        path="/topup"
        element={
          <SignedIn>
            <TopUpPage onNavigate={handleNavigation} />
          </SignedIn>
        }
      />
      <Route
        path="/success"
        element={
          <SignedIn>
            <SuccessPage {...transactionData} />
          </SignedIn>
        }
      />
      <Route
        path="/scan-receipt"
        element={
          <SignedIn>
            <ScanReceipt />
          </SignedIn>
        }
      />
      <Route
        path="/receipt-list"
        element={
          <SignedIn>
            <ReceiptList />
          </SignedIn>
        }
      />
      <Route
        path="/select-item"
        element={
          <SignedIn>
            <SelectItem />
          </SignedIn>
        }
      />
      <Route
        path="/payment-recap"
        element={
          <SignedIn>
            <PaymentRecap />
          </SignedIn>
        }
      />
      <Route
        path="/invitation-code"
        element={
          <SignedIn>
            <InvitationCode />
          </SignedIn>
        }
      />
      <Route
        path="/join-room"
        element={
          <SignedIn>
            <JoinRoom />
          </SignedIn>
        }
      />
      <Route
        path="/scan-qr"
        element={
          <SignedIn>
            <QRScanner />
          </SignedIn>
        }
      />

      {/* Redirect if route not found */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default App;
