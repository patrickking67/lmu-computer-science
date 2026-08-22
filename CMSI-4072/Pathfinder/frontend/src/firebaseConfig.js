import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, getDoc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyB2jOozxz2M8uaOaBFczuWdhrIVd_EWNE0",
  authDomain: "pathfinder-cae4f.firebaseapp.com",
  projectId: "pathfinder-cae4f",
  storageBucket: "pathfinder-cae4f.firebasestorage.app",
  messagingSenderId: "796942115846",
  appId: "1:796942115846:web:e6facbf6f83a2bf0fd8f87"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();
const db = getFirestore(app);

 export const myBucket = firebaseConfig.storageBucket;

// Function to check if user has completed questionnaire
export const checkUserQuestionnaire = async (uid) => {
  const userDoc = await getDoc(doc(db, "users", uid));
  return userDoc.exists() && userDoc.data().questionnaireCompleted;
};

// Function to sign in with Google
export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    const user = result.user;

    // Check if user exists in Firestore
    const userRef = doc(db, "users", user.uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
      // If new user, store in Firestore
      await setDoc(userRef, {
        email: user.email,
        questionnaireCompleted: false, // Default to false
      });
    }
    return user;
  } catch (error) {
    console.error("Login Error:", error);
  }
};

// Function to log out
export const logOut = async () => {
  try {
    await signOut(auth);
    console.log("User Logged Out");
  } catch (error) {
    console.error("Logout Error:", error);
  }
};

export { auth, db };
