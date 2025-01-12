import db from "./firebaseConfig";
import { doc, getDoc, addDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";

const createRoomAndAddItems = async (userId, items) => {
    try {
      
      const roomData = {
        user_id: userId,
        room_name: null, 
        date: new Date().toISOString(),
        status: "open", 
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

  const getRoomData = async (roomId) => {
    try {
      const roomRef = doc(db, "rooms", roomId);
      const roomSnap = await getDoc(roomRef);
  
      if (roomSnap.exists()) {
        return {
          success: true,
          data: roomSnap.data(),
        };
      } else {
        return {
          success: false,
          message: "Room not found.",
        };
      }
    } catch (error) {
      console.error("Error fetching room data:", error);
      return {
        success: false,
        message: "An error occurred while fetching the room data.",
        error,
      };
    }
  };

  export { createRoomAndAddItems, getRoomData };