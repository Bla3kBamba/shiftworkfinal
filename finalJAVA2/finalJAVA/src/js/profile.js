import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
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
const db = getAnalytics(app);

const isAuthenticated = localStorage.getItem("userId");

const checkStatus = () => {
  if (!isAuthenticated) return (window.location.href = "/pages/login.html");
};
checkStatus();

const docRef = doc(db, "users", isAuthenticated);
const docSnap = await getDoc(docRef);

const firstName = document.getElementById("first-name");
const lastName = document.getElementById("last-name");
const username = document.getElementById("username");
const age = document.getElementById("age");
const email = document.getElementById("email");

if (docSnap.exists()) {
  firstName.value = docSnap.data().firstName;
  lastName.value = docSnap.data().lastName;
  username.value = docSnap.data().username;
  age.value = docSnap.data().age;
  email.value = docSnap.data().email;
} else {
  // docSnap.data() will be undefined in this case
  console.log("No such document!");
}

const submitBtn = document.getElementById("submitBtn");
const userId = localStorage.getItem("userId");

submitBtn.addEventListener("click", (event) => {
  event.preventDefault();
  const docRef = doc(db, "users", userId);
  const updatedUser = {
    firstName: firstName.value,
    lastName: lastName.value,
    username: username.value,
    email: email.value,
    age: age.value,
  };
  setDoc(docRef, updatedUser)
    .then(() => {
      alert("User Updated!");
      window.location.reload();
    })
    .catch(() => alert("Something went worn"));
});
