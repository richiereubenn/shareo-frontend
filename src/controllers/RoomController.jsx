import db from "./firebaseConfig";
import { doc, getDoc, addDoc, collection, query, where, getDocs } from "firebase/firestore";

const createRoomAndAddItems = async (userId, items, roomName) => {
  try {

    const roomData = {
      user_id: userId,
      room_name: roomName,
      date: new Date().toISOString(),
      status: "open",
    };

    const roomRef = await addDoc(collection(db, "rooms"), roomData);
    console.log("Created room with ID:", roomRef.id);
    const roomId = roomRef.id; // Get the auto-generated room ID

    // Step 2: Insert into `items` table
    const itemPromises = items.map((item) => {
      const itemData = {
        item_name: item.full_description,
        item_qty: item.quantity,
        item_price: item.price,
        room_id: roomId, // Foreign key
        user_id: "", // Initially null
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

/**
 * Get all items by room ID.
 * @param {string} roomId - The ID of the room.
 * @returns {Promise<Object>} Items data and status of the operation.
 */
const getItemsByRoomId = async (roomId) => {
  try {
    // Validate the roomId input
    if (!roomId) {
      throw new Error("Room ID is required.");
    }

    // Reference to the items collection
    const itemsRef = collection(db, "items");

    // Query to filter items by roomId
    const q = query(itemsRef, where("room_id", "==", roomId));

    // Execute the query
    const querySnapshot = await getDocs(q);

    // Extract data from the query result
    const items = querySnapshot.docs.map((doc) => ({
      id: doc.id, // Document ID
      ...doc.data(), // All item fields
    }));

    // Return success with the items data
    return {
      success: true,
      data: items,
    };
  } catch (error) {
    console.error("Error fetching items by room ID:", error);
    return {
      success: false,
      message: error.message,
    };
  }
};

export { createRoomAndAddItems, getRoomData, getItemsByRoomId };