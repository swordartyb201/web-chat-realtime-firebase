// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { connectFirestoreEmulator, getFirestore } from "firebase/firestore";
import {
  connectAuthEmulator,
  FacebookAuthProvider,
  getAuth,
  GoogleAuthProvider,
} from "firebase/auth";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDjTE_jF6Z55sbSnjCY3IGAicjVsZ3aIEo",
  authDomain: "webchat-29273.firebaseapp.com",
  databaseURL: "https://webchat-29273-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "webchat-29273",
  storageBucket: "webchat-29273.appspot.com",
  messagingSenderId: "132508439809",
  appId: "1:132508439809:web:a6460d2b3c044654a5f700",
  measurementId: "G-BZ5EX71F9R",
};

const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
const providerGg = new GoogleAuthProvider();
const providerFb = new FacebookAuthProvider();
const db = getFirestore(app);
const storage = getStorage(app);

// if (window.location.hostname === "localhost") {
//   connectAuthEmulator(auth, "http://127.0.0.1:9099");
//   connectFirestoreEmulator(db, "127.0.0.1", "8080");
// }

export { auth, providerGg, providerFb, db, storage };
