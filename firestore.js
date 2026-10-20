import { initializeApp } from "https://www.gstatic.com/firebasejs/10.8.0/firebase-app.js";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "https://www.gstatic.com/firebasejs/10.8.0/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyBxRRGqqBKW4IcfuGmQqnPv5TiS4z56gIQ",
  authDomain: "grandma-s-kitchen-bacd0.firebaseapp.com",
  projectId: "grandma-s-kitchen-bacd0",
  storageBucket: "grandma-s-kitchen-bacd0.firebasestorage.app",
  messagingSenderId: "31978071435",
  appId: "1:31978071435:web:2c426c22a7fafa34b47b8e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);

export { collection, addDoc, getDocs, doc, updateDoc, deleteDoc };