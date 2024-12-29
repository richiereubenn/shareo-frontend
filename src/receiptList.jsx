import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReceiptList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [items, setItems] = useState([]);

    useEffect(() => {
        console.log('location.state:', location.state);
        if (Array.isArray(location.state)) {
            setItems(location.state);
        } else {
            setItems([]);
        }
    }, [location.state]);

    const handleInputChange = (index, field, value) => {
        const updatedItems = [...items];
        updatedItems[index][field] = value;
        setItems(updatedItems);
    };

    const isFormComplete = () => {
        return items.every(item => item.name.trim() !== '' && item.quantity.trim() !== '' && item.price.trim() !== '');
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (isFormComplete()) {
            console.log('Form data submitted:', items);
            navigate('/selectItem', { state: items });
        }
    };

    return (
        <div className="max-w-md mx-auto p-8 bg-white shadow-lg rounded-lg" style={{ fontFamily: 'Arial, sans-serif' }}>
            <h2 className="text-2xl font-bold mb-6 text-center text-teal-600">Receipt Summary</h2>
            <form onSubmit={handleSubmit}>
                {items.map((item, index) => (
                    <div key={index} className="mb-4">
                        <h3 className="text-lg font-semibold mb-2">Item {index + 1}</h3>
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-1">Name</label>
                            <input
                                type="text"
                                name={`name-${index}`}
                                value={item.name}
                                onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-gray-800 focus:ring focus:border-teal-500"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-1">Quantity</label>
                            <input
                                type="text"
                                name={`quantity-${index}`}
                                value={item.quantity}
                                onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-gray-800 focus:ring focus:border-teal-500"
                            />
                        </div>
                        <div className="mb-2">
                            <label className="block text-gray-700 mb-1">Price</label>
                            <input
                                type="text"
                                name={`price-${index}`}
                                value={item.price}
                                onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                                className="w-full px-3 py-2 border rounded-md text-gray-800 focus:ring focus:border-teal-500"
                            />
                        </div>
                    </div>
                ))}
                <div className="flex justify-between items-center">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="py-2 px-4 bg-black text-white rounded-md hover:bg-gray-800 transition duration-200"
                    >
                        Edit
                    </button>
                    <button
                        type="submit"
                        className={`py-2 px-4 bg-teal-600 text-white rounded-md hover:bg-teal-700 transition duration-200 ${isFormComplete() ? '' : 'opacity-50 cursor-not-allowed'}`}
                        disabled={!isFormComplete()}
                    >
                        Konfirmasi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReceiptList;
