import db from "./firebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";

/**
 * Add a new record to the `item_user` table when a user selects an item.
 * @param {Object} data - Data containing item_id, user_id, room_id, and additional fields if needed.
 * @returns {Promise<Object>} Result of the operation.
 */
export const addItemToUser = async (data) => {
    try {
        const { item_id, user_id, room_id } = data;

        // Validate required fields
        if (!item_id || !user_id || !room_id) {
            throw new Error("Item ID, User ID, and Room ID are required.");
        }

        // Generate a unique document ID (you can use Firestore's auto-ID generation or combine item_id, user_id, and room_id)
        const newDocId = `${item_id}_${user_id}_${room_id}`; // Example: Use a composite key

        // Reference to the item_user collection
        const itemUserRef = doc(collection(db, "item_user"), newDocId);

        // Create the data object
        const itemUserData = {
            item_id,
            user_id,
            room_id,
            created_at: new Date().toISOString(),
        };

        // Add the record to Firestore
        await setDoc(itemUserRef, itemUserData);

        return {
            success: true,
            message: "Item added to user successfully!",
        };
    } catch (error) {
        console.error("Error adding item to user:", error);
        return {
            success: false,
            message: "An error occurred while adding the item to the user.",
            error,
        };
    }
}

export { addItemToUser };