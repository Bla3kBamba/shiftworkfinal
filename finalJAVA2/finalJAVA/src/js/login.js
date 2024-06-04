import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

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
const auth = getAuth();

const checkStatus = () => {
  const isAuthenticated = localStorage.getItem("userId");
  if (isAuthenticated) return (window.location.href = "/");
};
checkStatus();

const submitBtn = document.getElementById("submitBtn");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;
  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      localStorage.setItem("userId", user.uid);
      window.location.href = "/";
    })
    .catch((error) => {
      alert("Invalid email or password!");
    });
});
