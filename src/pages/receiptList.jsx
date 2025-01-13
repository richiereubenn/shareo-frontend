import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getItemsByRoomId, getRoomData } from '../controllers/RoomController';
import { useUser } from '@clerk/clerk-react';

const ReceiptList = () => {
    // const location = useLocation();
    const navigate = useNavigate();
    const { roomId } = useParams();
    const { user } = useUser()

    const [items, setItems] = useState([]);
    const [isEditing, setIsEditing] = useState(false);
    const [scanDate, setScanDate] = useState('');
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });
    const [roomData, setRoomData] = useState(null);
    const [totalPrice, setTotalPrice] = useState(0);

    // useEffect(() => {
    //     if (location.state) {
    //         const { items = [], receiptName = '', scanDate = '' } = location.state;
    //         setItems(items);
    //         setReceiptName(receiptName);
    //         setScanDate(scanDate);
    //         if (items.length > 0) {
    //             calculateTotals(items);
    //         }
    //     }
    // }, [location.state]);

    useEffect(() => {
        console.log("User : " + user.firstName)
        const fetchRoom = async () => {
            try {
                const result = await getRoomData(roomId);
                console.log("Room:", result);

                if (result.success) {
                    console.log("Successfully fetched room:", result);
                    // Assuming `setItems` is a state setter for storing fetched room data
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
                    console.log("Items:", result.data);
                    const fetchedItems = result.data;
                    setItems(fetchedItems);

                    // Calculate the total price
                    const total = fetchedItems.reduce((sum, item) => {
                        return sum + item.item_price * item.item_qty;
                    }, 0);

                    setTotalPrice(total);
                } else {
                    console.error("Failed to fetch items:", result.message);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [roomId]); // Dependency array ensures this effect runs when roomId changes


    const calculateTotals = (items) => {
        if (!items) return;
        const subtotal = items.reduce((acc, item) => acc + (parseFloat(item.price) * parseInt(item.quantity)), 0);
        const tax = subtotal * 0.1;
        const total = subtotal + tax;
        setTotals({ subtotal, tax, total });
    };

    const handleInputChange = (e, index, field) => {
        const value = e.target.value;
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
        console.log("Navigating to select-item page with roomId: " + roomData.room_id);
        navigate('/select-item/' + roomId);
    };

    return (
        <div className="p-8 bg-white">
            <h2 className="text-2xl font-bold mb-2 text-left">{roomData?.room_name}</h2>
            <p className="text-left text-gray-600 mb-8">{scanDate}</p>
            {/* Dummy */}
            {/* <h2 className="text-2xl font-bold mb-2 text-left">{roomData?.room_name}</h2>
            <p className="text-left text-gray-600 mb-8">{scanDate}</p> */}
            {/* Real */}
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
                        <p className="text-lg">Rp {totalPrice}</p>
                        {/* <p className="text-lg">Rp 15</p> */}
                        <p className="text-lg font-bold text-indigo-700">Rp {totalPrice}</p>
                    </div>
                </div>
                <div className="flex justify-between items-center mt-4">
                    <button
                        type="button"
                        onClick={() => navigate(-1)}
                        className="py-2 px-4 me-2 w-1/2 bg-black text-white rounded-full hover:bg-gray-700 transition duration-200"
                    >
                        Edit
                    </button>
                    <button
                        type="submit"
                        className="py-2 px-4 ms-2 w-1/2 bg-indigo-700 text-white rounded-full hover:bg-indigo-800 transition duration-200"
                    >
                        Konfirmasi
                    </button>
                </div>
            </form>
            {/* Dummy */}
        </div >
    );
};

export default ReceiptList;
