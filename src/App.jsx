import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, useSession } from "@clerk/clerk-react";
import AuthPage from "./pages/AuthPage";
import Homepage from "./pages/Homepage";
import PaymentPage from "./pages/PaymentPage";
import TopUpPage from "./pages/TopUpPage";
import SuccessPage from "./pages/SuccessPage";
import ScanReceipt from "./pages/scanReceipt";
import ReceiptList from "./pages/receiptList";
import SelectItem from "./pages/selectItem";
import PaymentRecap from "./pages/paymentRecap";
import InvitationCode from "./pages/InvitationCodePage";
import JoinRoom from "./pages/JoinRoomPage";
import QRScanner from "./pages/QRScannerPage";
import { useUser } from "@clerk/clerk-react";

function App() {

  const navigate = useNavigate()

  const { isSignedIn, user } = useUser()
  if (isSignedIn) {
    // console.log(user.firstName)
    // console.log("Navigating to home ... ")
    // navigate("/home")
  }

  const [transactionData, setTransactionData] = useState(null);

  const handleNavigation = (page, data) => {
    if (data) {
      setTransactionData(data);
    }
  };

  return (
    <Routes>
      <Route path="/" element={(
        <SignedOut>
          <AuthPage />
        </SignedOut>
      )} />

      <Route
        path="/home"
        element={
          <SignedIn>
            <Homepage />
          </SignedIn>
        }
      />
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
        path="/receipt-list/:roomId"
        element={
          <SignedIn>
            <ReceiptList />
          </SignedIn>
        }
      />
      <Route
        path="/select-item/:roomId" 
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
        path="/invitation-code/:roomId"
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
      <Route path="*" element={<Navigate to="/home" replace />} />
    </Routes>
  );
}

export default App;
