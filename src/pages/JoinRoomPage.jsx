import React, { useState, useEffect } from "react";
import Button from "../components/Button";
import { useNavigate } from "react-router-dom";
import { getRoomData } from "../controllers/RoomController";// Import your `getRoomData` function

function JoinRoom() {
  const [roomCode, setRoomCode] = useState("");
  const [roomData, setRoomData] = useState(null); // To store fetched room data
  const [errorMessage, setErrorMessage] = useState(null); // For clear error messages
  const [isLoading, setIsLoading] = useState(false); // To indicate data fetching state
  const navigate = useNavigate();

  const handleJoinRoom = async () => {
    setIsLoading(true); // Set loading state
    setErrorMessage(null); // Clear any previous errors

    try {
      const response = await getRoomData(roomCode);
      if (response.success) {
        setRoomData(response.data);
        navigate(`/select-item/${roomCode}`); // Navigate with roomCode if successful
      } else {
        setErrorMessage(response.message); // Display error message from response
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      setErrorMessage("An error occurred while joining the room."); // Generic error message
    } finally {
      setIsLoading(false); // Clear loading state
    }
  };

  useEffect(() => {
    // Clear room data and error message when roomCode changes or component mounts
    setRoomData(null);
    setErrorMessage(null);
  }, [roomCode]); // Dependency array for useEffect

  return (
    <div className="relative h-screen bg-gray-100 p-4">
      <div className="absolute top-4 left-4">
        <button className="text-4B1AD4 text-3xl font-bold hover:opacity-80" onClick={() => navigate("/scan-qr")} >
          &#8592;
        </button>
      </div>

      <h1 className="pt-10 font-bold text-4xl mb-6">Join Room</h1>

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

      {errorMessage && <p className="text-red-500">{errorMessage}</p>}
      {isLoading && <p>Checking room code...</p>}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full p-4">
        <Button text="Join Room" onClick={handleJoinRoom} disabled={!roomCode || isLoading} />
      </div>
    </div>
  );
}

export default JoinRoom;