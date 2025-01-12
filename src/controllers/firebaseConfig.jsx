// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
    // apiKey: import.meta.env.FIREBASE_API_KEY,
    // authDomain: import.meta.env.FIREBASE_AUTH_DOMAIN,
    // databaseURL: import.meta.env.DATABASE_URL,
    // projectId: import.meta.env.PROJECT_ID,
    // storageBucket: import.meta.env.STORAGE_BUCKET,
    // messagingSenderId: import.meta.env.MESSAGING_SENDER_ID,
    // appId: import.meta.env.APP_ID

    apiKey: "AIzaSyBeFLGkDOSJUBPM78xrl1fI0YthiRN-BJA",
    authDomain: "shareo-depd.firebaseapp.com",
    databaseURL: "https://shareo-depd-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "shareo-depd",
    storageBucket: "shareo-depd.firebasestorage.app",
    messagingSenderId: "113341380188",
    appId: "1:113341380188:web:584f5b1e14e1e12ed31899"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;