import db from "./firebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";

// Function to get user details by ID
const getUserDetails = async (userId) => {
    try {
        // Reference to the user document
        const userDocRef = doc(db, "users", userId);

        // Fetch the document
        const userSnapshot = await getDoc(userDocRef);

        // Check if the document exists
        if (userSnapshot.exists()) {
            // Return the user data
            return {
                success: true,
                data: userSnapshot.data(),
            };
        } else {
            // If user does not exist
            return {
                success: false,
                message: "User not found",
            };
        }
    } catch (error) {
        console.error("Error fetching user details:", error);
        return {
            success: false,
            message: "An error occurred while fetching user details",
        };
    }
};

// Function to get all transactions by user ID
const getUserTransactions = async (userId) => {
    try {
        // Reference to the transactions collection
        const transactionsRef = collection(db, "transactions");

        // Query to fetch transactions where userId matches
        const q = query(transactionsRef, where("user_id", "==", userId));

        // Execute the query
        const querySnapshot = await getDocs(q);

        // Extract and return the data from the documents
        const transactions = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return {
            success: true,
            data: transactions,
        };
    } catch (error) {
        console.error("Error fetching transactions:", error);
        return {
            success: false,
            message: "An error occurred while fetching transactions",
        };
    }
};


export default { getUserDetails, getUserTransactions };