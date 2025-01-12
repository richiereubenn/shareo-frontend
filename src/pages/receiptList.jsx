import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const ReceiptList = () => {
    const location = useLocation();
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [items, setItems] = useState([]);
    const [receiptName, setReceiptName] = useState('');
    const [scanDate, setScanDate] = useState('');
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });

    useEffect(() => {
        if (location.state) {
            console.log("Location state:", location.state);
            const { items = [], receiptName = '', scanDate = '' } = location.state;
            setItems(items || []);
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

        if (field === 'quantity' || field === 'price') {
            updatedItems[index].totalPrice = parseFloat(updatedItems[index].price) * parseInt(updatedItems[index].quantity);
        }

        setItems(updatedItems);
        calculateTotals(updatedItems);
    };

    const toggleEditing = () => {
        setIsEditing(!isEditing);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate('/select-item', { state: { items, receiptName, scanDate, totals } });
    };

    return (
        <div className="p-8 bg-white">
            <h2 className="text-2xl font-bold mb-2 text-left">{receiptName}</h2>
            <p className="text-left text-gray-600 mb-8">{scanDate}</p>
            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-1 mb-4">
                    <span className="font-semibold">Nama</span>
                    <span className="font-semibold">Qty</span>
                    <span className="font-semibold">Satuan</span>
                    <span className="font-semibold">Harga Total</span>
                </div>
                {items.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2 mb-2">
                        <input
                            type="text"
                            value={item.name}
                            disabled={!isEditing}
                            onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                            className="self-center"
                        />
                        <input
                            type="number"
                            value={item.quantity}
                            disabled={!isEditing}
                            onChange={(e) => handleInputChange(index, 'quantity', e.target.value)}
                            className="self-center"
                        />
                        <input
                            type="text"
                            value={item.price}
                            disabled={!isEditing}
                            onChange={(e) => handleInputChange(index, 'price', e.target.value)}
                            className="self-center"
                        />
                        <input
                            type="text"
                            value={(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}
                            disabled
                            className="self-center"
                        />
                    </div>
                ))}
                <div className="flex justify-between mt-8">
                    <div className="text-left">
                        <p className="text-lg">Jumlah</p>
                        <p className="text-lg">Tax</p>
                        <p className="text-lg font-bold text-indigo-700">Jumlah Total</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg">Rp {totals.subtotal.toFixed(2)}</p>
                        <p className="text-lg">Rp {totals.tax.toFixed(2)}</p>
                        <p className="text-lg font-bold text-indigo-700">Rp {totals.total.toFixed(2)}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        type="button"
                        onClick={toggleEditing}
                        className="py-2 px-4 me-2 w-1/2 bg-black text-white rounded-full hover:bg-gray-700 transition duration-200"
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 ms-2 w-1/2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 transition duration-200"
                    >
                        Konfirmasi
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ReceiptList;




    // Dummy
    // const [items, setItems] = useState([
    //     { name: 'Italian Steak & Fries', quantity: 1, price: 36.00, totalPrice: 36.00 },
    //     { name: 'Beef Salad', quantity: 1, price: 29.50, totalPrice: 29.50 },
    //     { name: 'Chicken Salad', quantity: 1, price: 28.50, totalPrice: 28.50 },
    //     { name: 'Beef', quantity: 1, price: 38.50, totalPrice: 38.50 },
    //     { name: 'Scrambled Eggs', quantity: 2, price: 13.50, totalPrice: 27.00 },
    //     { name: 'Soup', quantity: 2, price: 17.50, totalPrice: 35.00 },
    //     { name: 'Vanilla & Lemon Martini', quantity: 1, price: 18.50, totalPrice: 18.50 },
    //     { name: 'Homemade Lemonade', quantity: 1, price: 6.75, totalPrice: 6.75 },
    //     { name: 'Water', quantity: 2, price: 3.75, totalPrice: 7.50 }
    // ]);

    {/* Dummy */}
            {/* <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-4 gap-1 mb-4" style={{ gridTemplateColumns: '3fr 1fr 2fr 2fr' }}>
                    <span className="font-semibold">Nama</span>
                    <span className="font-semibold">Qty</span>
                    <span className="font-semibold">Satuan</span>
                    <span className="font-semibold">Harga Total</span>
                </div>
                <div>
                    {items.map((item, index) => (
                        <div key={index} className="grid grid-cols-4 gap-1 mb-2" style={{ gridTemplateColumns: '3fr 1fr 2fr 2fr' }}>
                            <input
                                type="text"
                                value={item.name}
                                onChange={(e) => handleInputChange(e, index, 'name')}
                                className="self-center"
                                disabled={!isEditing}
                            />
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={(e) => handleInputChange(e, index, 'quantity')}
                                className="self-center"
                                disabled={!isEditing}
                            />
                            <input
                                type="text"
                                value={item.price}
                                onChange={(e) => handleInputChange(e, index, 'price')}
                                className="self-center"
                                disabled={!isEditing}
                            />
                            <input
                                type="text"
                                value={item.totalPrice.toFixed(2)}
                                disabled
                                className="self-center"
                            />
                        </div>
                    ))}
                </div>
                <hr className="my-4 border-gray-400" />
                <div className="flex justify-between mt-6">
                    <div className="text-left">
                        <p className="text-lg">Jumlah</p>
                        <p className="text-lg">Tax</p>
                        <p className="text-lg font-bold text-indigo-700">Jumlah Total</p>
                    </div>
                    <div className="text-right">
                        <p className="text-lg">Rp 227.75</p>
                        <p className="text-lg">Rp 15</p>
                        <p className="text-lg font-bold text-indigo-700">Rp 242.75</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        type="button"
                        onClick={toggleEditing}
                        className="py-2 px-4 me-2 w-1/2 bg-black text-white rounded-full hover:bg-gray-700 transition duration-200"
                    >
                        {isEditing ? 'Save' : 'Edit'}
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 ms-2 w-1/2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 transition duration-200"
                    >
                        Konfirmasi
                    </button>
                </div>
            </form> */}