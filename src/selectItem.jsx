import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SelectItem = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);

    useEffect(() => {
        console.log('location.state:', location.state);
        if (Array.isArray(location.state)) {
            setItems(location.state);
        }
    }, [location.state]);

    const handleQuantityChange = (index, delta) => {
        const updatedItems = [...items];
        const newQuantity = parseInt(updatedItems[index].quantity, 10) + delta;
        if (newQuantity >= 0) {
            updatedItems[index].quantity = newQuantity.toString();
            setItems(updatedItems);
        }
    };

    const calculateTotal = () => {
        return items.reduce((total, item) => total + (parseInt(item.quantity, 10) * parseInt(item.price, 10)), 0);
    };

    const handlePayment = () => {
        alert(`Total payment is Rp ${calculateTotal()}`);
        navigate('/');
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
            <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">Select Item</h2>
            <p className="text-center text-gray-600 mb-4">20 DESEMBER 2024</p>
            <p className="text-center text-gray-600 mb-8">Rafi</p>
            <form>
                {items.map((item, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between items-center mb-2">
                            <h3 className="text-lg font-semibold">{item.name}</h3>
                            <div className="flex items-center">
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(index, -1)}
                                    className="py-1 px-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-200"
                                >
                                    -
                                </button>
                                <span className="mx-2">{item.quantity}</span>
                                <button
                                    type="button"
                                    onClick={() => handleQuantityChange(index, 1)}
                                    className="py-1 px-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-200"
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
                    <p className="text-2xl font-bold text-teal-600">Rp {calculateTotal()}</p>
                </div>
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={handlePayment}
                        className="py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-200"
                    >
                        Pay Rp {calculateTotal()}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SelectItem;
