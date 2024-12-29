import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SelectItem = () => {
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

    const handleQuantityChange = (index, delta) => {
        const updatedItems = [...items];
        const newQuantity = parseInt(updatedItems[index].quantity, 10) + delta;
        if (newQuantity >= 0) {
            updatedItems[index].quantity = newQuantity.toString();
            setItems(updatedItems);
            calculateTotals(updatedItems);
        }
    };

    const calculateTotals = (items) => {
        if (!items) return;
        const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity)), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        setTotals({ subtotal, tax, total });
    };

    const handlePayment = () => {
        const paymentRecapData = items.map(item => ({
            name: item.name,
            total: parseInt(item.quantity, 10) * parseFloat(item.price),
            status: 'Unpaid'
        }));
        navigate('/paymentRecap', { state: { payments: paymentRecapData, scanDate } });
    };

    return (
        <div className="p-8 bg-white shadow-lg rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => navigate(-1)} className="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <h2 className="text-2xl font-bold text-center text-black">Select Item</h2>
                <div className="w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                    </svg>
                </div>
            </div>
            <p className="text-center text-gray-600 mb-1">{scanDate}</p>
            <p className="text-center text-indigo-700 mb-4">Created by: {receiptName}</p>
            <form>
                {items.map((item, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(index, -1)}
                                    className="py-1 px-3 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-200"
                                >
                                    -
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(index, 1)}
                                    className="py-1 px-3 bg-gray-300 text-black rounded-md hover:bg-gray-400 transition duration-200"
                                >
                                    +
                                </button>
                            </div>
                            <span>Rp {item.price}</span>
                        </div>
                    </div>
                ))}
                <div className="mt-8 text-center">
                    <h3 className="text-lg font-semibold mb-2">Total Tagihan Anda</h3>
                    <p className="text-2xl font-bold text-indigo-700">Rp {totals.total.toFixed(2)}</p>
                </div>
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={handlePayment}
                        className="py-2 px-4 bg-indigo-700 text-white rounded-md hover:bg-indigo-700 transition duration-200"
                    >
                        Pay Rp {totals.total.toFixed(2)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SelectItem;
