import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import {
  getFirestore,
  doc,
  setDoc,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPuVmerivsQYNR5el0resAG5ew8yC7dqg",
    authDomain: "shifts-work-final.firebaseapp.com",
    projectId: "shifts-work-final",
    storageBucket: "shifts-work-final.appspot.com",
    messagingSenderId: "705248013537",
    appId: "1:705248013537:web:64873feb3b33d842d25ba0",
    measurementId: "G-LHJ6JSFLZY"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

const checkStatus = () => {
  const isAuthenticated = localStorage.getItem("userId");
  if (isAuthenticated) return (window.location.href = "index.html");
};

checkStatus();

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const firstName = document.getElementById("first-name").value;
  const lastName = document.getElementById("last-name").value;
  const username = document.getElementById("username").value;
  const age = document.getElementById("age").value;
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  createUserWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      const docRef = doc(db, "users", user.uid);
      const newUser = {
        firstName,
        lastName,
        username,
        email,
        age,
      };
      setDoc(docRef, newUser)
        .then(() => {
          alert("Register success!");
          window.location.href = "login.html";
        })
        .catch(() => alert("Something went worn"));
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = errorCode.message;
      alert("User already exist!");
    });
});
