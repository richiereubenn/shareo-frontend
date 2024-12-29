import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

const ScanReceipt = () => {
    const [image, setImage] = useState(null);
    const [ocrData, setOcrData] = useState([]);
    const [receiptName, setReceiptName] = useState('');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const startCamera = () => {
            navigator.mediaDevices.getUserMedia({ video: true })
                .then(stream => {
                    videoRef.current.srcObject = stream;
                    videoRef.current.play();
                })
                .catch(err => {
                    console.error("Error accessing webcam: ", err);
                });
        };
        startCamera();
        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const stream = videoRef.current.srcObject;
                const tracks = stream.getTracks();
                tracks.forEach(track => track.stop());
            }
        };
    }, []);

    const parseText = (text) => {
        console.log("OCR Text:", text);

        const itemPattern = /(\d+)\s+(.+?)\s+(\d+\.\d+)/g;
        const namePattern = /Nama Nota\s*:\s*(.+)/i;
        const matches = [];
        let match;
        let receiptName = '';

        const nameMatch = namePattern.exec(text);
        if (nameMatch) {
            receiptName = nameMatch[1].trim();
        }

        while ((match = itemPattern.exec(text)) !== null) {
            matches.push({
                quantity: match[1].trim(),
                name: match[2].trim(),
                price: match[3].trim()
            });
        }

        console.log("Parsed Items:", matches);
        return { matches, receiptName };
    };

    const capturePhoto = () => {
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL('image/png');
        setImage(photoData);
        processOCR(photoData);
    };

    const processOCR = (dataUrl) => {
        Tesseract.recognize(dataUrl, 'eng', {
            logger: (m) => console.log(m)
        }).then(({ data: { text } }) => {
            console.log("OCR Text:", text);
            const { matches, receiptName } = parseText(text);
            setOcrData(matches);
            setReceiptName(receiptName);
        });
    };

    const handleFileChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const imgUrl = reader.result;
                setImage(imgUrl);
                processOCR(imgUrl);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleNext = () => {
        const scanDate = new Date().toLocaleDateString('id-ID', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
        console.log("Navigating with data:", ocrData);
        navigate('/receiptList', { state: { items: ocrData, receiptName, scanDate } });
    };

    return (
        <div className="flex flex-col p-8">
            <div className='flex flex-col h-[660px] justify-between'>
                <div className='flex flex-col'>
                    <div className='flex flex-col justify-center items-center'>
                        <video ref={videoRef} width="300" height="300" className="border text-center" />
                        <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }} />
                        <button
                            onClick={capturePhoto}
                            className="mt-4 bg-indigo-700 text-white py-2 px-4 rounded-full w-12 h-12 flex items-center justify-center"
                        >
                        </button>
                    </div>
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="mt-4"
                    />
                    {image && (
                        <div className="flex mt-4 gap-3">
                            <h2 className="text-lg font-semibold">Preview :</h2>
                            <img src={image} alt="Captured" className="mt-2 border w-[180px]" width="400" />
                        </div>
                    )}
                </div>
                <div>
                    <button
                        onClick={handleNext}
                        className={`mt-4 w-full rounded border-2 border-indigo-700 px-12 py-2 text-sm font-medium ${image ? 'bg-indigo-700 text-white hover:bg-transparent hover:text-indigo-700' : 'bg-gray-400 text-white border-transparent cursor-not-allowed'} focus:outline-none focus:ring active:text-indigo-00`}
                        disabled={!image}
                    >
                        Next
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ScanReceipt;
