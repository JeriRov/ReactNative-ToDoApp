import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage"

const firebaseConfig = {
  apiKey: "AIzaSyC4zTH7bgFGf4uJudMZwzGlCf7GGHpo_v4",
  authDomain: "todoapp-497cc.firebaseapp.com",
  projectId: "todoapp-497cc",
  storageBucket: "todoapp-497cc.appspot.com",
  messagingSenderId: "34735464817",
  appId: "1:34735464817:web:2e06340ea744b837ba96d0",
  measurementId: "G-RYV3RRR401"
};

const app = initializeApp(firebaseConfig);
const storage = getStorage()
const auth = getAuth();
const db = getFirestore();

export {
    storage,
    auth,
    db
}