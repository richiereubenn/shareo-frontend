import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { addDoc, doc, updateDoc } from "firebase/firestore";

const createTransactionsAndPaymentInfo = async (title, total, paid, userIds, roomId) => {
    try {
        // Create the transaction data
        const transactionData = {
            title: title, // Example: user1-user2-123456789
            date: Date.now().toString().slice(-8), // Fix date creation (use new Date() instead of new Date.now())
            total: total,
            paid: paid,
        };

        // Add the transaction to the "transactions" collection
        const transactionRef = await addDoc(collection(db, "transactions"), transactionData);
        const transactionId = transactionRef.id;  // Get the generated transaction ID

        // Create payments for each user involved in the split
        for (let userId of userIds) {
            const paymentData = {
                user_id: userId,
                room_id: roomId,
                transaction_id: transactionId, // Link payment to transaction
            };

            // Add the payment to the "payments" collection for each user
            await addDoc(collection(db, "payments"), paymentData);
        }

        return {
            success: true,
            message: "Transaction and payments created successfully!",
            transactionId,
        };

    } catch (e) {
        console.error("Error creating transaction and payment", e);
        return {
            success: false,
            message: "An error occurred while creating transaction and payments.",
            error: e,
        };
    }
};

const getUsersFromTransaction = async (transactionId) => {
    try {
        // Query the "payments" collection to get all users linked to the transaction
        const q = query(collection(db, "payments"), where("transaction_id", "==", transactionId));
        const querySnapshot = await getDocs(q);

        // Create an array to store the user IDs of the other users
        const users = [];

        // Loop through the query results to collect user IDs, excluding the current user
        querySnapshot.forEach((doc) => {
            const paymentData = doc.data();
            otherUsers.push(paymentData.user_id);
        });

        // Return the list of other users involved in the transaction
        return {
            success: true,
            message: "Other users retrieved successfully!",
            users,
        };

    } catch (e) {
        console.error("Error retrieving other users", e);
        return {
            success: false,
            message: "An error occurred while retrieving other users.",
            error: e,
        };
    }
};



export default { createTransactionsAndPaymentInfo, getUsersFromTransaction };