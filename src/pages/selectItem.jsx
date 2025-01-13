import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { getItemsByRoomId, getRoomData, createTransaction, updateItemQuantity } from '../controllers/RoomController';
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
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const result = await getItemsByRoomId(roomId);
                if (result.success) {
                    setItems(result.data);
                } else {
                    console.error("Failed to fetch items:", result.message);
                }
            } catch (error) {
                console.error("Error fetching items:", error);
            }
        };

        fetchItems();
    }, [roomId]);

    const handleItemClick = async (item) => {
        if (item.item_qty <= 0) return; // Prevent selecting if quantity is 0
    
        const updatedQuantity = item.item_qty - 1;
    
        try {
            // Update the quantity in the database
            const result = await updateItemQuantity(item.id, updatedQuantity);
            if (result.success) {
                // Update the local state
                const updatedItems = items.map((i) =>
                    i.id === item.id
                        ? { ...i, item_qty: updatedQuantity }
                        : i
                );
                setItems(updatedItems);
    
                // Add to selected items or update quantity
                const existingItem = selectedItems.find((i) => i.id === item.id);
                if (existingItem) {
                    const updatedSelectedItems = selectedItems.map((i) =>
                        i.id === item.id
                            ? { ...i, selected_qty: i.selected_qty + 1 }
                            : i
                    );
                    setSelectedItems(updatedSelectedItems);
                } else {
                    setSelectedItems([...selectedItems, { ...item, selected_qty: 1 }]);
                }
    
                calculateTotals([...selectedItems, { ...item, selected_qty: 1 }]);
            } else {
                alert("Failed to update item quantity in the database.");
            }
        } catch (error) {
            console.error("Error updating item quantity:", error);
        }
    };
    

    const calculateTotals = (selectedItems) => {
        const total = selectedItems.reduce((sum, item) => {
            return sum + item.item_price * item.selected_qty;
        }, 0);
        setTotals({ total });
    };

    const handlePayment = async () => {
        if (selectedItems.length === 0) {
            alert("Please select at least one item to proceed.");
            return;
        }
    
        const paymentData = selectedItems.map((item) => ({
            item_name: item.item_name,
            selected_qty: item.selected_qty,
            item_price: item.item_price,
            total_price: item.item_price * item.selected_qty,
        }));
    
        try {
            const result = await createTransaction(user.id, roomId, paymentData, totals.total);
    
            if (result.success) {
                alert("Transaction successfully created!");
                navigate('/payment-recap', {
                    state: {
                        transactionId: result.transactionId,
                        payments: paymentData,
                        totalAmount: totals.total,
                        scanDate,
                    },
                });
            } else {
                console.error(result.message);
                alert("Failed to create transaction.");
            }
        } catch (error) {
            console.error("Error in handlePayment:", error);
            alert("An unexpected error occurred.");
        }
    };

    return (
        <div className="p-8 bg-white">
            <h2 className="text-2xl font-bold text-black mb-4">Select Items</h2>
            {items.map((item) => (
                <div key={item.id} className="mb-4">
                    <div className="flex justify-between items-center">
                        <h3 className="text-lg">{item.item_name}</h3>
                        <p>Qty: {item.item_qty}</p>
                        <p>Rp {item.item_price}</p>
                        <button
                            onClick={() => handleItemClick(item)}
                            className="py-1 px-3 bg-indigo-500 text-white rounded"
                            disabled={item.item_qty <= 0}
                        >
                            Select
                        </button>
                    </div>
                </div>
            ))}
            <div className="mt-8">
                <h3 className="text-lg font-bold mb-4">Selected Items</h3>
                {selectedItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-center">
                        <h3 className="text-lg">{item.item_name}</h3>
                        <p>Qty: {item.selected_qty}</p>
                        <p>Rp {item.item_price * item.selected_qty}</p>
                    </div>
                ))}
            </div>
            <div className="mt-8">
                <h3 className="text-lg font-bold">Total: Rp {totals.total.toFixed(2)}</h3>
                <button
                    onClick={handlePayment}
                    className="py-2 px-4 bg-green-500 text-white rounded mt-4"
                >
                    Proceed to Payment
                </button>
            </div>
        </div>
    );
};

export default SelectItem;
