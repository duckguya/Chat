// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
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

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
// const analytics = getAnalytics(app);
