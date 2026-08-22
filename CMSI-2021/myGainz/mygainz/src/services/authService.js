import { useState, useEffect } from "react";
import { signInWithPopup, GoogleAuthProvider, signOut } from "firebase/auth";
import { auth, db } from "./firebaseConfig";
import { doc, setDoc, getDoc } from "firebase/firestore";
import starterRoutines from '../data/starter_routines.json';

export async function InitiateSignIn() {
  try {
    const { user } = await signInWithPopup(auth, new GoogleAuthProvider());
    const data = {
      name: user.displayName,
      uid: user.uid,
      programs: starterRoutines
    };
    const docRef = doc(db, "users", data.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) return;

    await setDoc(doc(db, "users", data.uid), data);
  } catch (err) {
    console.error(err);
  }
}

export function InitiateSignOut() {
  return signOut(auth);
}

export function useAuthentication() {
  const [user, setUser] = useState(null);
  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      user ? setUser(user) : setUser(null);
    });
  }, []);
  return user;
}