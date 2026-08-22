import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAs224jC8EDyQ9oCBvMAAqsKZCMTh9F_i8",
  authDomain: "mygainz2022.firebaseapp.com",
  projectId: "mygainz2022",
  storageBucket: "mygainz2022.appspot.com",
  messagingSenderId: "636811062899",
  appId: "1:636811062899:web:25ac691b96a1ed397dc406"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);