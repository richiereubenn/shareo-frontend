import React, { useState, useEffect } from "react";
import QRCode from "react-qr-code";
import Button from "../components/Button";
import { getRoomData } from "../controllers/RoomController"; // Import fungsi getRoomData

function InvitationCode({ roomId }) { // Terima roomId sebagai prop
  const [roomData, setRoomData] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRoomData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        if (!roomId) {
          setError("Room ID tidak tersedia.");
          return; // Hentikan fetching jika roomId tidak ada
        }
        const response = await getRoomData(roomId);
        if (response.success) {
          setRoomData(response.data);
        } else {
          setError(response.message);
        }
      } catch (error) {
        console.error("Error fetching room data:", error);
        setError("Terjadi kesalahan saat mengambil data ruangan.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchRoomData();
  }, [roomId]); // Tambahkan roomId ke dependency array

  if (isLoading) {
    return <p>Memuat data ruangan...</p>;
  }

  if (error) {
    return <p className="text-red-500">{error}</p>;
  }

  if (!roomData) {
    return <p>Data ruangan tidak ditemukan.</p>;
  }

  // Jika data ruangan berhasil diambil
  const roomCode = roomId; // Kode QR sekarang menggunakan roomId
  return (
    <div className="relative h-screen bg-gray-100 p-4 font-poppins">
      <div className="absolute top-4 left-4">
        <button
          className="text-3xl font-bold hover:opacity-80"
          onClick={() => window.history.back()}
        >
          &#8592;
        </button>
      </div>

      <h1 className="pt-10 font-bold text-4xl mb-1">Invitation Code</h1>

      {/* Tampilkan data ruangan */}
      <p className="text-lg font-semibold text-gray-700 mb-20">
        Nama Nota: {roomData.room_name || "Tidak ada nama nota"} {/* Gunakan data dari roomData */}
      </p>

      <div className="flex flex-col items-center mb-6">
        <QRCode value={roomCode} className="mb-4" size={256} level="H"/> {/* Gunakan roomId untuk QR Code */}
        <p className="text-lg">
          Room Code: <span className="font-bold text-[#4B1AD4]">{roomCode}</span>
        </p>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-full p-4">
        <Button text="Selesai" onClick={() => alert("Selesai")} isDisabled={false} />
      </div>
    </div>
  );
}

export default InvitationCode;