import { doc, getDoc } from "firebase/firestore";
import { collection, query, where, getDocs } from "firebase/firestore";
import { addDoc, doc, updateDoc } from "firebase/firestore";

const createTransactionsAndPaymentInfo = async (userId, roomId, paid) => {
    try {
        const transactionData = {
            user_id: userId,
            room_id: roomId,
            amount: paid,
        };

        const transactionRef = await addDoc(collection(db, "transactions"), transactionData);
        const transactionId = transactionData.id;

        const paymentData = {
            user_id: userId,
            room_id: roomId,
            transaction_id: transactionId,
        } 

        const paymentRef = await addDoc(collection(db, "payments"), paymentData);

        return {
            success: true,
            message: "Transaction and payment created successfully!",
            paymentId,
        };


    } catch (e) {
        console.error("Error creating transaction and payment", e);
        return {
            success: false,
            message: "An error occurred while creating transaction and payment.",
            error,
        };
    }
};

const getItemsFromTransaction = async (transactionId) => {
    try {
        const t = collection(db, "transactions_items");
        const q = query(t, where("transaction_id", "==", transactionId));
        const qSnap = await getDocs(q);

        const items = qSnap.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return {
            success: true,
            data: items
        }
    } catch (error) {
        console.error("Error fetching items in transaction", error);
        return {
            success: false,
            message: "An error occurred while fetching items in transaction",
        };
    }
};

export default { createTransactionsAndPaymentInfo, getItemsFromTransaction };