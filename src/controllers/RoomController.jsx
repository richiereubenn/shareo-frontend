import db from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { addDoc, doc, updateDoc } from "firebase/firestore";

const createRoomAndAddItems = async (userId, items) => {
    try {
      // Step 1: Insert into `rooms` table
      const roomData = {
        user_id: userId,
        room_name: null, // Initially null
        date: new Date().toISOString(),
        status: "open", // Initially 'open'
      };
  
      const roomRef = await addDoc(collection(db, "rooms"), roomData);
      const roomId = roomRef.id; // Get the auto-generated room ID
  
      // Step 2: Insert into `items` table
      const itemPromises = items.map((item) => {
        const itemData = {
          item_name: item.item_name,
          item_qty: item.item_qty,
          item_price: item.item_price,
          room_id: roomId, // Foreign key
          user_id: null, // Initially null
          status: "none", // Initially 'none'
        };
  
        // Add each item to the items collection
        return addDoc(collection(db, "items"), itemData);
      });
  
      // Wait for all item inserts to complete
      await Promise.all(itemPromises);
  
      return {
        success: true,
        message: "Room and items created successfully!",
        roomId,
      };
    } catch (error) {
      console.error("Error creating room and adding items:", error);
      return {
        success: false,
        message: "An error occurred while creating the room or adding items.",
        error,
      };
    }
  };

  export default { createRoomAndAddItems };