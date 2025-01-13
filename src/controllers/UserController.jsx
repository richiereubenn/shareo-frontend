import db from "./firebaseConfig";
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc } from "firebase/firestore";

/**
 * Create a new user in the `users` collection.
 * @param {Object} userData - User data containing user_id, firstname, lastname, username, email, phone_number, password, and balance.
 * @param {number} amount - The amount to top up.
 * @param {string} paymentMethod - The selected payment method.
 * @returns {Promise<Object>} Result of the operation.
 */
const createNewUser = async (userData) => {
    try {
        const { user_id, firstname, lastname, username, email, phone_number, password, balance } = userData;

        // Validate required fields
        if (!user_id || !firstname || !lastname || !username || !email || !phone_number || !password || balance === undefined) {
            throw new Error("All fields are required.");
        }

        // User data object
        const user = {
            user_id,
            firstname,
            lastname,
            username,
            email,
            phone_number,
            password, // Store hashed password
            balance,
        };

        // Add the user to Firestore
        await setDoc(doc(collection(db, "users"), user_id), user);

        return {
            success: true,
            message: "User created successfully!",
        };
    } catch (error) {
        console.error("Error creating new user:", error);
        return {
            success: false,
            message: "An error occurred while creating the user.",
            error,
        };
    }
};

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
        // Query the "payments" collection to get all payments for the user
        const paymentsQuery = query(collection(db, "payments"), where("user_id", "==", userId));
        const paymentsSnapshot = await getDocs(paymentsQuery);

        // Create an array to hold the transaction IDs
        const transactionIds = [];
        
        // Loop through the payment documents and collect the transaction IDs
        paymentsSnapshot.forEach((doc) => {
            const paymentData = doc.data();
            transactionIds.push(paymentData.transaction_id);  // Collect the transaction ID
        });

        // If no payments are found for the user, return an empty result
        if (transactionIds.length === 0) {
            return {
                success: true,
                message: "No transactions found for this user.",
                transactions: [],
            };
        }

        // Query the "transactions" collection to get details of each transaction
        const transactionsQuery = query(
            collection(db, "transactions"),
            where("id", "in", transactionIds) // Use "in" to fetch multiple transactions
        );
        const transactionsSnapshot = await getDocs(transactionsQuery);

        // Create an array to hold the transaction data
        const transactions = [];
        
        // Loop through the transactions and add them to the array
        transactionsSnapshot.forEach((doc) => {
            const transactionData = doc.data();
            transactions.push(transactionData);  // Collect transaction details
        });

        // Return the list of transactions for the user
        return {
            success: true,
            message: "Transactions retrieved successfully!",
            transactions,
        };

    } catch (e) {
        console.error("Error retrieving transactions for user", e);
        return {
            success: false,
            message: "An error occurred while retrieving transactions.",
            error: e,
        };
    }
};

export const getUserBalance = async (userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const userDoc = await getDoc(userRef);

        if (userDoc.exists()) {
            return userDoc.data().balance || 0;
        } else {
            throw new Error('User not found');
        }
    } catch (error) {
        console.error('Error fetching user balance:', error);
        throw error;
    }
};

// Update user balance
export const updateBalance = async (userId, amount) => {
    try {
        if (typeof userId !== 'string') {
            throw new Error('Invalid userId: must be a string.');
        }
        const userRef = doc(db, 'users', userId);

        const userDoc = await getDoc(userRef);
        if (!userDoc.exists()) {
            throw new Error('User not found.');
        }

        const currentBalance = userDoc.data().balance || 0;
        const updatedBalance = currentBalance + amount;

        await updateDoc(userRef, { balance: updatedBalance });

        return {
            success: true,
            updatedBalance,
        };
    } catch (error) {
        console.error('Error updating balance:', error);
        return {
            success: false,
            message: error.message || 'Failed to update balance.',
        };
    }
};

// Top Up
export const topUp = async (userId, amount, paymentMethod) => {
    try {
        const transactionId = `${userId}-${Date.now()}`;

        const transactionRef = doc(db, 'topups', transactionId);

        const transactionData = {
            userId,
            amount,
            paymentMethod,
            status: 'success',
            createdAt: new Date().toISOString(),
        };
        await setDoc(transactionRef, transactionData);

        const balanceUpdate = await updateBalance(userId, amount);

        if (balanceUpdate.success) {
            return {
                success: true,
                transactionId,
                updatedBalance: balanceUpdate.updatedBalance,
            };
        } else {
            return {
                success: false,
                message: balanceUpdate.message,
            };
        }
    } catch (error) {
        console.error('Error during top-up:', error);
        return {
            success: false,
            message: error.message || 'Failed to process top-up',
        };
    }
};

export { createNewUser, getUserDetails, getUserTransactions };