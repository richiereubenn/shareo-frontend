import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getItemsByRoomId, getRoomData, updateItemData } from '../controllers/RoomController';

const ReceiptList = () => {
    const navigate = useNavigate();
    const { roomId } = useParams();

    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [receiptName, setReceiptName] = useState('');
    const [scanDate, setScanDate] = useState('');
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });
    const [roomData, setRoomData] = useState(null);

    useEffect(() => {
        const fetchRoom = async () => {
            try {
                const result = await getRoomData(roomId);
                console.log("Room:", result);

                if (result.success) {
                    console.log("Successfully fetched room:", result);
                    setRoomData(result.data);
                } else {
                    console.error("Failed to fetch room:", result.message);
                }
            } catch (error) {
                console.error("Error fetching room:", error);
            }
        };

        fetchRoom();

        const fetchItems = async () => {
            try {
                const result = await getItemsByRoomId(roomId);
                console.log("Items:", result);

                if (result.success) {
                    console.log("Successfully fetched items:", result);
                    setItems(result.data);
                    calculateTotals(result.data);
                } else {
                    console.error("Failed to fetch items:", result.message);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [roomId]);

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

    const handleSave = async () => {
        try {
            // Save each item to the database
            const savePromises = items.map((item) => updateItemData(item.id, item));
            await Promise.all(savePromises);

            console.log("Successfully saved items");
            setIsEditing(false);
        } catch (error) {
            console.error("Error saving items:", error);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        navigate(`/select-item/${createRoom.roomCode}`, { state: { items, receiptName, scanDate, totals } });
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
                    {isEditing ? (
                        <button
                            type="button"
                            onClick={handleSave}
                            className="py-2 px-4 me-2 w-1/2 bg-black text-white rounded-full hover:bg-gray-700 transition duration-200"
                        >
                            Save
                        </button>
                    ) : (
                        <button
                            type="button"
                            onClick={toggleEditing}
                            className="py-2 px-4 me-2 w-1/2 bg-black text-white rounded-full hover:bg-gray-700 transition duration-200"
                        >
                            Edit
                        </button>
                    )}
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