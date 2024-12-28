import React, { useState } from 'react'
import Tesseract from 'tesseract.js'

const scanReceipt = ({ onComplete }) => {
    const [scannedText, setScannedText] = useState('')
    const [image, setImage] = useState(null)

    const handleImageChange = (event) => {
        const file = event.target.files[0]
        const reader = new FileReader()
        reader.onloadend = () => {
            setImage(reader.result)
        }
        reader.readAsDataURL(file)
    }

    const handleScan = () => {
        if (image) {
            Tesseract.recognize(
                image,
                'eng',
                {
                    logger: (m) => console.log(m)
                }
            ).then(({ data: { text } }) => {
                setScannedText(text)
                const items = parseItems(text)
                onComplete(items)
            })
        }
    }

    const parseItems = (text) => {
        const lines = text.split('\n')
        return lines.map((line) => {
            const parts = line.split(' ')
            return {
                name: parts.slice(0, -3).join(' '),
                quantity: Number(parts[parts.length - 3]),
                unitPrice: Number(parts[parts.length - 2]), 
                totalPrice: Number(parts[parts.length - 1])
            }
        })
    }

    return (
        <div>
            <h1>Scan Your Receipt</h1>
            <input type='file' accept='image/*' onChange={handleImageChange} />
            <button onClick={handleScan}>Scan</button>
            {image && <img src={image} alt="Receipt" style={{ width: '300px', marginTop: '20px' }} />}
            <div>
                <h2>Scanned Text:</h2>
                <p>{scannedText}</p>
            </div>
        </div>
    )
}

export default scanReceipt