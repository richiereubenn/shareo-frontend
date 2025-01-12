import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Tesseract from 'tesseract.js';

const ScanReceipt = () => {
    const [image, setImage] = useState(null);
    const [ocrData, setOcrData] = useState([]);
    const [receiptName, setReceiptName] = useState('');
    const [facingMode, setFacingMode] = useState('environment');
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const navigate = useNavigate();

    useEffect(() => {
        const startCamera = () => {
            navigator.mediaDevices.getUserMedia({ video: { facingMode } })
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
    }, [facingMode]);

    // const toggleCamera = () => {
    //     setFacingMode(prevMode => (prevMode === 'user' ? 'environment' : 'user'));
    // };

    const parseText = (text) => {
        console.log("OCR Text:", text);

        const itemPattern = /(\d+)\s+(.+?)\s+-\s+(\d+\.\d+)/g;
        const namePattern = /Bill Number:\s*(\d+)/i;
        const datePattern = /Date:\s*(\d{2}[A-Z]{3}\d{4}\s\d{2}:\d{2}:\d{2})/i;
        const matches = [];
        let match;
        let receiptName = '';
        let receiptDate = '';

        const nameMatch = namePattern.exec(text);
        if (nameMatch) {
            receiptName = `Bill No: ${nameMatch[1].trim()}`;
        }

        const dateMatch = datePattern.exec(text);
        if (dateMatch) {
            receiptDate = dateMatch[1].trim();
        }

        while ((match = itemPattern.exec(text)) !== null) {
            matches.push({
                quantity: match[1].trim(),
                name: match[2].trim(),
                price: match[3].trim()
            });
        }

        console.log("Parsed Items:", matches);
        return { matches, receiptName, receiptDate };
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
            const { matches, receiptName, receiptDate } = parseText(text);
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
                        <video ref={videoRef} width="1000" height="500" className="border text-center" />
                        <canvas ref={canvasRef} width="400" height="300" style={{ display: 'none' }} />
                        <div className="flex space-x-4 mt-4">
                            <button
                                onClick={capturePhoto}
                                className="bg-gray-400 text-white py-2 px-4 w-12 h-12 flex items-center justify-center"
                            >
                                
                            </button>
                            {/* <button
                                onClick={toggleCamera}
                                className="bg-gray-400 text-white py-2 px-4 rounded-full w-12 h-12 flex items-center justify-center"
                            >
                                
                            </button> */}
                        </div>
                    </div>
                    <div className='flex justify-center'>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="mt-4"
                        />
                    </div>
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
                        className={`mt-4 w-full rounded border-2 border-gray-400 px-12 py-2 text-sm font-medium ${image ? 'bg-gray-400 text-white hover:bg-transparent hover:text-gray-700' : 'bg-gray-200 border-gray-200 text-white border-transparent cursor-not-allowed'} focus:outline-none focus:ring active:text-gray-00`}
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
