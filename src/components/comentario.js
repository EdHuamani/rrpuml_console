import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { addDoc, collection, doc, getFirestore, serverTimestamp, setDoc } from "firebase/firestore";



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


const registerComment = async (subject, comment, state = "nuevo") => {
  try {
    const created_at = serverTimestamp();
    const section = "A14";
    await addDoc(collection(db, "comments"), {
      created_by: auth.currentUser.uid,
      user_email: auth.currentUser.email,
      subject,
      authProvider: "local",
      comment,
      state,
      created_at,
      section
    });
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};
const registerCommentAnswer = async (comment_id, subject, comment, state = "nuevo") => {
  try {
    const created_at = serverTimestamp();
    const section = "A14";
    const data = {
      // comment_id,
      created_by: auth.currentUser.uid,
      user_email: auth.currentUser.email,
      subject,
      authProvider: "local",
      comment,
      state,
      created_at,
      section
    };
    console.log(data);
    await addDoc(collection(db, `answers/${comment_id}/answers`), data);
    const ref = `comments/${comment_id}`;

    /// update status
    await setDoc(doc(db, ref), {
      state: "atendido"
    }, { merge: true });

  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

// const getComments = async




export {
  registerComment,
  registerCommentAnswer
};
