// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import type { FirebaseApp } from "firebase/app";
import type { Auth } from "firebase/auth";
import type { Firestore } from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
};

export const isFirebaseConfigured = Object.values(firebaseConfig).every(Boolean);

// Initialize Firebase
const appInstance = isFirebaseConfigured ? initializeApp(firebaseConfig) : null;
export const app = appInstance as FirebaseApp;
export const auth = appInstance ? getAuth(appInstance) : (null as unknown as Auth);
export const db = appInstance
  ? getFirestore(appInstance)
  : (null as unknown as Firestore);
