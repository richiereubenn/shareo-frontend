import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReceiptList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);
    const [receiptName, setReceiptName] = useState('');
    const [scanDate, setScanDate] = useState('');
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

    useEffect(() => {
        if (location.state) {
            const { items = [], receiptName = '', scanDate = '' } = location.state;
            setItems(items);
            setReceiptName(receiptName);
            setScanDate(scanDate);
            if (items.length > 0) {
                calculateTotals(items);
            }
        }
    }, [location.state]);

    const calculateTotals = (items) => {
        if (!items) return;
        const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity)), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        setTotals({ subtotal, tax, total });
    };

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
        calculateTotals(updatedItems);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/selectItem', { state: { items, receiptName, scanDate, totals } });
    };

    return (
        <div className="p-8 bg-white shadow-lg rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
            <h2 className="text-2xl font-bold mb-4 text-center text-teal-600">{receiptName}</h2>
            <p className="text-center text-gray-600 mb-8">{scanDate}</p>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-2 mb-4">
                    <span className="font-semibold">Nama</span>
                    <span className="font-semibold">Qty</span>
                    <span className="font-semibold">Satuan</span>
                    <span className="font-semibold">Harga Total</span>
                </div>
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                        <span className="self-center">{item.name}</span>
                        <span className="self-center">{item.quantity} x</span>
                        <span className="self-center">{item.price}</span>
                        <span className="self-center">{(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}</span>
                    </div>
                ))}
                <div className="mt-8 text-right">
                    <p className="text-lg">Jumlah: Rp {totals.subtotal.toFixed(2)}</p>
                    <p className="text-lg">Tax: Rp {totals.tax.toFixed(2)}</p>
                    <p className="text-lg font-bold text-indigo-700">Jumlah Total: Rp {totals.total.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-700 transition duration-200"
                    >
                        Edit
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 bg-indigo-700 text-white rounded-md hover:bg-indigo-800 transition duration-200"
                    >
                        Konfirmasi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReceiptList;
