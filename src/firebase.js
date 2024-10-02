// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import{getAuth,GoogleAuthProvider} from "firebase/auth";
import {getFirestore,doc,setDoc} from "firebase/firestore";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAcuPPtL1LR_XW-kAxZiGSA8LOQXxmyxag",
  authDomain: "financely-d4a36.firebaseapp.com",
  projectId: "financely-d4a36",
  storageBucket: "financely-d4a36.appspot.com",
  messagingSenderId: "995855113884",
  appId: "1:995855113884:web:e3ab5464f8303cf81b5759",
  measurementId: "G-62KQ39BRCB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db=getFirestore(app);
const auth=getAuth(app);
const provider=new GoogleAuthProvider();
export {db,auth,provider,doc,setDoc};