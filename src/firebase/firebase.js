import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

const firebaseConfig = {
  apiKey: "AIzaSyCBnFs2aoe97Pmfq0r8iY-ZrlFA9tL0NMY",
  authDomain: "online-trauma.firebaseapp.com",
  projectId: "online-trauma",
  storageBucket: "online-trauma.firebasestorage.app",
  messagingSenderId: "469154769664",
  appId: "1:469154769664:web:08a8a3e7eda323b56161e5",
  measurementId: "G-P7H5DX71QE"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
export const analytics = getAnalytics(app);