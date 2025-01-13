import db from "./firebaseConfig";
import { doc, setDoc, collection } from "firebase/firestore";

const addItemUser = async (roomId, itemId, userId) => {
    try {
        await addDoc(collection(db, "item_user"), {
            room_id: roomId,
            item_id: itemId,
            user_id: userId,
        });
        console.log("Document successfully written!");
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

export { addItemUser };