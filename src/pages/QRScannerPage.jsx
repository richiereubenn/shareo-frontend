import React, { useState } from "react";
import QrReader from "react-qr-scanner";
import { useNavigate } from "react-router-dom";

function QRScanner() {
  const [scanResult, setScanResult] = useState("");
  const navigate = useNavigate(); // Hook untuk navigasi

  // Fungsi untuk menangani hasil scan
  const handleScan = (data) => {
    if (data && data.text) {
      setScanResult(data.text);
      // Jika scan berhasil, langsung navigasi ke halaman berdasarkan hasil scan
      navigate(`/select-item/${data.text}`);
    }
  };

  // Fungsi untuk menangani error saat scanning
  const handleError = (err) => {
    console.error("QR Scanner Error:", err);  // Menangani error dan log error
  };

  // Gaya untuk membuat QR Reader selebar dan sepanjang layar
  const previewStyle = {
    height: "100%", // Menggunakan seluruh tinggi layar
    width: "100%",  // Menggunakan seluruh lebar layar
  };

  return (
    <div className="p-4 font-poppins">
      {/* Tombol Kembali */}
      <div className=" top-4 left-4">
        <button
          className="text-4B1AD4 text-3xl font-bold hover:opacity-80"
          onClick={() => navigate("/home")} // Navigasi ke halaman Home
        >
          &#8592;
        </button>
      </div>

      {/* Judul dan tombol "Using Code" */}
      <div className=" top-4 right-4 flex justify-between items-center my-2">
        <h1 className="font-bold text-3xl">Join Room</h1>
        <button
          className="px-6 h-[50px] bg-yellow-500 text-black font-semibold rounded-[20px] hover:bg-yellow-600"
          onClick={() => navigate("/join-room")} // Navigasi ke halaman join-room
        >
          Using Code
        </button>
      </div>

      {/* QR Scanner */}
      <div className="w-full h-full pt-10">
        <QrReader
          delay={300}
          style={previewStyle}
          facingMode="environment"  // Gunakan kamera belakang
          onError={handleError}  // Menangani error
          onScan={handleScan}    // Menangani hasil scan dan navigasi
        />
      </div>

    </div>
  );
}

export default QRScanner;
