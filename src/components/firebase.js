import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, onAuthStateChanged, sendPasswordResetEmail, signInWithEmailAndPassword, signInWithPopup, signOut } from "firebase/auth";
import { addDoc, collection, doc, getDocs, getFirestore, onSnapshot, orderBy, query, serverTimestamp, setDoc, updateDoc, where } from "firebase/firestore";



const firebaseConfig = {
  apiKey: "AIzaSyAeUR19owtKb3rEl8RArNKuMVUO9U3drzo",
  authDomain: "sistema-web-ldsp.firebaseapp.com",
  projectId: "sistema-web-ldsp",
  storageBucket: "sistema-web-ldsp.appspot.com",
  messagingSenderId: "81145412047",
  appId: "1:81145412047:web:b1946b1031b843d01cfaba",
  measurementId: "G-MZHZ0YZVMD"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const googleProvider = new GoogleAuthProvider();

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("uid", "==", user.uid));
    const docs = await getDocs(q);
    if (docs.docs.length === 0) {
      await addDoc(collection(db, "users"), {
        uid: user.uid,
        name: user.displayName,
        authProvider: "google",
        email: user.email,
      });
    }
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logInWithEmailAndPassword = async (email, password) => {
  try {
    await signInWithEmailAndPassword(auth, email, password);
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const registerWithEmailAndPassword = async (email, name, lastname, profile, section) => {
  try {
    const refUsers = doc(collection(db, "users"));
    // Validate email exists
    const q = query(collection(db, "users"), where("email", "==", email));
    const querySnapshot = await getDocs(q);

    if (querySnapshot.docs.length) {
      throw Error('email ya se encuentra registrado');
    }
    const created_at = serverTimestamp();

    await setDoc(refUsers, {
      // uid: user.uid,
      name,
      lastname,
      authProvider: "local",
      email,
      created_at,
      profile,
      section
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const editUser = async (uid, email, name, lastname, profile, section) => {
  const ref = doc(db, "users", uid);
  await updateDoc(ref, {
    email, name, lastname, profile, section,
  });
}


const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};


const logout = () => {
  signOut(auth);
};




export {
  auth,
  db,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getDocs,
  collection,
  onSnapshot,
  query,
  orderBy,
  onAuthStateChanged,
  editUser
};
