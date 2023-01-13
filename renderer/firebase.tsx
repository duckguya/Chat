// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBkS50LQ4CBX4bB0KrK1zdYazYypjqhPV4",
  authDomain: "chat-dd2a7.firebaseapp.com",
  projectId: "chat-dd2a7",
  storageBucket: "chat-dd2a7.appspot.com",
  messagingSenderId: "857786979364",
  appId: "1:857786979364:web:f986550de01ff0889874b1",
  measurementId: "G-46FRZ6NQVW",
};
// const firebaseConfig = {
//   apiKey: process.env.NEXT_PUBLIC_API_KEY,
//   authDomain: process.env.NEXT_PUBLIC_AUTH_DOMAIN,
//   projectId: process.env.NEXT_PUBLIC_PROJECT_ID,
//   storageBucket: process.env.NEXT_PUBLIC_STORAGE_BUCKET,
//   messagingSenderId: process.env.NEXT_PUBLIC_MESSAGING_SENDERID,
//   appId: process.env.NEXT_PUBLIC_APP_ID,
//   measurementId: process.env.NEXT_PUBLIC_MEASUREMENT_ID,
// };

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const dbService = getFirestore();
// const analytics = getAnalytics(app);
