import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyD0yxHhZO6J33ULmlPJ7E5EugnXbLlfdEw",
  authDomain: "imtiazstore1-dc1db.firebaseapp.com",
  projectId: "imtiazstore1-dc1db",
  storageBucket: "imtiazstore1-dc1db.firebasestorage.app",
  messagingSenderId: "313312224284",
  appId: "1:313312224284:web:a4ab5a06a3564849146bd9"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const firebaseApp = app;
