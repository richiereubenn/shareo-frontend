import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getItemsByRoomId, getRoomData } from '../controllers/RoomController';
import { useUser } from '@clerk/clerk-react';

import db from '../controllers/firebaseConfig';
import { collection, query, where, onSnapshot } from "firebase/firestore";


const SelectItem = () => {
    const { roomId } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [items, setItems] = useState([]);
    const [receiptName, setReceiptName] = useState('');
    const [scanDate, setScanDate] = useState('');
    const [totals, setTotals] = useState({ subtotal: 0, tax: 0, total: 0 });
    const [totalPrice, setTotalPrice] = useState(0);
    const [roomData, setRoomData] = useState(null);
    const [users, setUsers] = useState(['aaa', 'bbb'])
    const { user } = useUser()
    const [itemUserMapping, setItemUserMapping] = useState({});

    useEffect(() => {
        const q = query(collection(db, "item_user"));
        const unsubscribe = onSnapshot(q, (snapshot) => {
            const data = {};
            snapshot.forEach((doc) => {
                const { item_id, user_id } = doc.data();
                if (!data[item_id]) {
                    data[item_id] = [];
                }
                data[item_id].push(user_id);
            });
            setItemUserMapping(data);
        });

        return () => unsubscribe(); // Clean up the listener
    }, []);

    useEffect(() => {

        console.log("User : " + user.firstName)
        console.log("RoomId : " + roomId)

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

        const fetchItems = async () => {
            try {
                const result = await getItemsByRoomId(roomId);
                console.log("Items:", result);

                if (result.success) {
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
        fetchRoom();

    }, []);

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
        navigate('/payment-recap', { state: { payments: paymentRecapData, scanDate } });
    };

    // const handleItemClick = async (data) => {
    //     const result = await addItemToUser(data);
    //     console.log("Result:", result);
    // };

    return (
        <div className="p-8 bg-white">
            <p>Room code {roomId}</p>
            <div className="flex justify-between items-center mb-4">
                <button onClick={() => navigate(-1)} className="text-gray-600">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            </div>
            <div className="flex justify-between items-center mb-2">
                <h2 className="text-2xl font-bold text-left text-black">Select Item</h2>
                <a href={`/invitation-code/${roomId}`} className="w-6">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 4a1 1 0 011-1h16a1 1 0 011 1v16a1 1 0 01-1 1H4a1 1 0 01-1-1V4z" />
                    </svg>
                </a>
            </div>
            <p className="text-left text-gray-600 mb-1">{scanDate}</p>
            <p className="text-left text-indigo-700 mb-4">Created by: {receiptName}</p>
            {/* Dummy */}
            {/* <p className="text-left text-gray-600 mb-1">3 Januari 2025</p>
            <p className="text-left text-indigo-700 mb-6">Created by: Rafi</p> */}
            <form>
                {items.map((item, index) => (
                    <div key={index} className="mb-4" onClick={() => handleItemClick({ item_id: item.item_id, user_id: user.id, room_id: roomId })}>
                        <div className="grid grid-cols-3 gap-1 mb-2 items-center mb-2" style={{ gridTemplateColumns: '3fr 2fr 1fr' }}>
                            <h3 className="text-lg font-semibold">{item.item_name}</h3>
                            <h3 className="text-lg font-semibold">{item.item_qty}</h3>
                            <div className="flex items-center">
                            </div>
                            <span>Rp {item.item_price}</span>
                        </div>
                        {users.map((user, index) => (
                            <div key={index} className="flex justify-between items-center mb-2">
                                <h3 className="text-lg font-semibold">{user}</h3>
                                <span>Rp {item.item_price}</span>
                            </div>
                        ))}
                        <hr className="my-4 border-gray-300" />
                    </div>
                ))}


                {/* {Object.keys(itemUserMapping).map((itemId) => (
                    <div key={itemId}>
                        <h3>{`Item ${itemId}`}</h3>
                        <p>{`Users: ${itemUserMapping[itemId].join(", ")}`}</p>
                    </div>
                ))} */}

                <div className="flex justify-between mt-8 text-center">
                    <h3 className="text-lg font-bold mb-2 text-indigo-700">Total Tagihan Anda</h3>
                    <p className="text-2xl font-bold text-indigo-700">Rp {totals.total.toFixed(2)}</p>
                </div>
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={handlePayment}
                        className="py-2 px-6 bg-indigo-700 text-white font-bold rounded-full hover:bg-indigo-700 transition duration-200"
                    >
                        Pay Rp {totals.total.toFixed(2)}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default SelectItem;
