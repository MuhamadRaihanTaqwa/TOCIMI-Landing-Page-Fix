import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAcglYmeROHYvt_s8Zc3gr9fn2rSNN-D6I",
  authDomain: "tocimi-shop-baru.firebaseapp.com",
  projectId: "tocimi-shop-baru",
  storageBucket: "tocimi-shop-baru.firebasestorage.app",
  messagingSenderId: "534937298832",
  appId: "1:534937298832:web:6c334b8a36238506a23515"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
