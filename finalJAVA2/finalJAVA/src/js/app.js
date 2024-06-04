import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, getDocs, query, where } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

const firebaseConfig = {
  apiKey: "AIzaSyDPuVmerivsQYNR5el0resAG5ew8yC7dqg",
    authDomain: "shifts-work-final.firebaseapp.com",
    projectId: "shifts-work-final",
    storageBucket: "shifts-work-final.appspot.com",
    messagingSenderId: "705248013537",
    appId: "1:705248013537:web:64873feb3b33d842d25ba0",
    measurementId: "G-LHJ6JSFLZY"
};

let app = null;
let db = null;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getAnalytics(app);
  }
}

async function getShiftsFromFirestore(userId) {
  try {
    initializeFirebase();
    const q = query(collection(db, "shifts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const shifts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return shifts;
  } catch (error) {
    console.error("Error getting shifts from Firestore:", error);
    return [];
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const isAuthenticated = localStorage.getItem("userId");

  const withAuth = document.querySelector(".with-auth");
  const withoutAuth = document.querySelector(".without-auth");

  const renderNav = () => {
    if (isAuthenticated && withoutAuth) withoutAuth.classList.add("remove");
    if (!isAuthenticated && withAuth) withAuth.classList.add("remove");
  };
  
  renderNav();

  const logoutBtn = document.getElementById("logoutBtn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      localStorage.removeItem("userId");
      window.location.href = "/pages/login.html";
    });
  }
});
