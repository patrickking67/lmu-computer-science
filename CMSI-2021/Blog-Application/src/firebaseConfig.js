import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC3Xc_8rqN8HNdxLmMrItiSplvxS-27UiE",
  authDomain: "patrickking-blogapp.firebaseapp.com",
  projectId: "patrickking-blogapp",
  storageBucket: "patrickking-blogapp.appspot.com",
  messagingSenderId: "118955219048",
  appId: "1:118955219048:web:d4ea079de3915d191743dd"
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
