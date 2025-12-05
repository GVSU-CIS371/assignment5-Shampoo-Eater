import { getFirestore } from "firebase/firestore";
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"

export const firebaseConfig = {
  apiKey: "AIzaSyAMHJKh_yfgX0VxhFWXTAoJtB6V9OTU3II",
  authDomain: "cis371-a2af1.firebaseapp.com",
  projectId: "cis371-a2af1",
  storageBucket: "cis371-a2af1.firebasestorage.app",
  messagingSenderId: "2471886198",
  appId: "1:2471886198:web:9f820b8322b90658750e57"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export default db;
export const auth = getAuth(app);