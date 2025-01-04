import React, { useState } from "react";
import QRCode from "react-qr-code";
import Button from "../components/Button";

function InvitationCode() {
  const predefinedRoomCode = "kontol"; 
  const [roomCode, setRoomCode] = useState(predefinedRoomCode);

  return (
    <div className="relative h-screen bg-gray-100 p-4 font-poppins">
      <div className="absolute top-4 left-4">
        <button
          className=" text-3xl font-bold hover:opacity-80"
          onClick={() => window.history.back()} 
        >
          &#8592;
        </button>
      </div>

      <h1 className="pt-10 font-bold text-4xl mb-1">Invitation Code</h1>

      <p className="text-lg font-semibold text-gray-700 mb-20 ">Nama Nota</p>

      <div className="flex flex-col items-center mb-6">
        <QRCode value={roomCode} className="mb-4" />
        <p className="text-lg">
          Room Code: <span className="font-bold text-[#4B1AD4]">{roomCode}</span>
        </p>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full p-4">
        <Button
          text="Selesai"
          onClick={() => alert("Room Code Generated!")}
          isDisabled={false} 
        />
      </div>
    </div>
  );
}

export default InvitationCode;
