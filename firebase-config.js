// Import the functions you need from the SDKs you need
/* eslint-disable */
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, doc, setDoc, getDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, GoogleAuthProvider, signInWithPopup, updateProfile, setPersistence, browserLocalPersistence, sendPasswordResetEmail, onAuthStateChanged, signInWithPhoneNumber, RecaptchaVerifier, ConfirmationResult } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyDyZOH2-pnqwhxIsB1qIT-NHZwO75n7EWI",
  authDomain: "leo-tourism-system.firebaseapp.com",
  projectId: "leo-tourism-system",
  storageBucket: "leo-tourism-system.firebasestorage.app",
  messagingSenderId: "486773129265",
  appId: "1:486773129265:web:401a3d536fddaf89bcd510",
  measurementId: "G-JBG00CN22W"
};


// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);
const analytics = getAnalytics(app);
const googleProvider = new GoogleAuthProvider();

setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log("Auth persistence set to Local");
  })
  .catch((error) => {
    console.error("Error setting auth persistence:", error);
  });

onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User is signed in:", user);
    // You can fetch additional user data from Firestore here
  } else {
    console.log("No user is signed in");
  }
});

const registerWithEmailAndPassword = async (email, password, username) => {
  if (!email || !password) {
    console.error("Email and password must be provided.");
    throw new Error("Email and password are required.");
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    await updateProfile(user, {
      displayName: username,
    });
    console.log("User registered with display name:", user.displayName);
    return user;
  } catch (error) {
    console.error("Error registering user:", error);
    throw error;
  }
};

// Function for email/password login
const loginWithEmailAndPassword = async (email, password) => {
  if (!email || !password) {
    console.error("Email and password must be provided.");
    throw new Error("Email and password are required.");
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in:", error);
    throw error;
  }
}; 

// Function for Google sign-in
const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    if (!userDocSnapshot.exists()) {
      // If the user doesn't exist in Firestore, create a new document
      await setDoc(userDocRef, {
        name: user.displayName,
        email: user.email,
        username: user.email.split('@')[0],  // You can set the username to the part before '@' if needed
        createdAt: new Date(),
      });
      console.log("User profile created in Firestore");
    } else {
      console.log("User profile already exists in Firestore");
    }

    return user;
  } catch (error) {
    console.error("Error signing in with Google:", error);
    throw error;
  }
};

// Phone number sign-up function
const signUpWithPhoneNumber = async (phoneNumber, recaptchaContainerId) => {
  try {
    // Create reCAPTCHA verifier
    const recaptchaVerifier = new RecaptchaVerifier(recaptchaContainerId, {
      size: 'invisible',
      callback: (response) => {
        console.log("reCAPTCHA solved", response);
      }
    }, auth);

    // Send SMS verification code
    const confirmationResult = await signInWithPhoneNumber(auth, phoneNumber, recaptchaVerifier);
    return confirmationResult; // This will allow you to verify the code
  } catch (error) {
    console.error("Error sending verification code:", error);
    throw error;
  }
};

// Verify the SMS code entered by the user
const verifyPhoneNumberCode = async (confirmationResult, code) => {
  try {
    const result = await confirmationResult.confirm(code);
    console.log("Phone number verified", result.user);
    return result.user; // This is the signed-in user
  } catch (error) {
    console.error("Error verifying phone number code:", error);
    throw error;
  }
};

// Verifies the token in reset email
const verifyResetCode = async (oobCode) => {
  return await verifyPasswordResetCode(auth, oobCode);
};

// Updates the password
const confirmReset = async (oobCode, newPassword) => {
  return await confirmPasswordReset(auth, oobCode, newPassword);
};

export {
  db,
  auth,
  registerWithEmailAndPassword,
  loginWithEmailAndPassword,
  signInWithGoogle,
  sendPasswordResetEmail,
  verifyResetCode,
  confirmReset,
  signUpWithPhoneNumber,
  verifyPhoneNumberCode
};
