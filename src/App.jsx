import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import InvitationCode from "./pages/InvitationCodePage";
import JoinRoom from "./pages/JoinRoomPage";
import QRScanner from "./pages/QRScannerPage";
import Homepage from "./pages/Homepage";

function App() {
  return (
    <Router>
      {/* <nav>
        <Link to="/invitation-code">Invitation Code</Link>
        <Link to="/join-room">Join Room</Link>
        <Link to="/scan-qr">Scan QR</Link>
      </nav> */}
      <Routes>
        
        <Route path="" element={<Homepage />} />
        <Route path="/invitation-code" element={<InvitationCode />} />
        <Route path="/join-room" element={<JoinRoom />} />
        <Route path="/scan-qr" element={<QRScanner />} />
      </Routes>
    </Router>
  );
}

export default App;
