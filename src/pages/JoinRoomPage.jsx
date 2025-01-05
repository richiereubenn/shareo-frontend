import React, { useState } from "react";
import Button from "../components/Button";

function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");

  const joinRoom = () => {
    alert(`Joining Room: ${roomCode}`);
  };

  return (
    <div className="relative h-screen bg-gray-100 p-4">
      <div className="absolute top-4 left-4">
        <button className="text-4B1AD4 text-3xl font-bold hover:opacity-80">
          &#8592; 
        </button>
      </div>

      <h1 className="pt-10  font-bold text-4xl mb-6">Join Room</h1>

      <div className="flex flex-col items-start">
        <label
          htmlFor="roomCode"
          className="text-md font-semibold text-gray-700 mb-2"
        >
          Room Code
        </label>
        <input
          type="text"
          id="roomCode"
          className="border-2 border-[#b093ff] p-3 rounded-md w-full text-md focus:outline-none focus:border-[#4B1AD4] focus:shadow-md transition-all duration-200 placeholder:text-gray-500"
          placeholder="Enter Room Code"
          value={roomCode}
          onChange={(e) => setRoomCode(e.target.value)}
        />
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full p-4">
        <Button
          text="Join Room"
          onClick={joinRoom}
          disabled={!roomCode} 
        />
      </div>
    </div>
  );
}

export default JoinRoom;
