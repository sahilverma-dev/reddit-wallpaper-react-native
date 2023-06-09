import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "#####################",
  authDomain: "#####################",
  databaseURL: "#####################",
  projectId: "#####################",
  storageBucket: "#####################",
  messagingSenderId: "#####################",
  appId: "#####################",
};

const app = initializeApp(firebaseConfig);

const firestore = getFirestore(app);
const auth = getAuth(app);

export { auth, firestore };
