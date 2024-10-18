// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

import { getAuth } from 'firebase/auth';
import { getFirestore,writeBatch } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDxExsyduXDXBiYWXo7M0lCuy6EkQMHCjU",
  authDomain: "budgetease-93a97.firebaseapp.com",
  projectId: "budgetease-93a97",
  storageBucket: "budgetease-93a97.appspot.com",
  messagingSenderId: "789970269224",
  appId: "1:789970269224:web:cb5c89136cdb8e4d43711d",
  measurementId: "G-3W4HWSPEZ4"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Function to create a new Firestore batch
const createBatch = () => writeBatch(db);

export { auth, db, storage, createBatch };