import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import { getFirestore, collection, addDoc, Timestamp, query, where, getDocs } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-analytics.js";

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
    db =  getAnalytics(app);
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

async function getShiftsThisMonth(userId) {
  try {
    initializeFirebase();
    const q = query(collection(db, "shifts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const shifts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    // Filter shifts for the current month
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth() + 1; // Months are zero-indexed
    const shiftsThisMonth = shifts.filter(shift => {
      const shiftDate = new Date(shift.date);
      return shiftDate.getMonth() + 1 === currentMonth;
    });
    return shiftsThisMonth.length;
  } catch (error) {
    console.error("Error getting shifts for the current month:", error);
    return 0;
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const submitBtn = document.querySelector("button[type='submit']");

  submitBtn.addEventListener("click", async (event) => {
    event.preventDefault();
    const userId = localStorage.getItem("userId");
    const date = document.getElementById("date").value;
    const startTime = document.getElementById("start-time").value;
    const endTime = document.getElementById("end-time").value;
    const hourlyWage = document.getElementById("hourly-wage").value;
    const role = document.getElementById("role").value;
    const branch = document.getElementById("branch").value;

    if (!date || !startTime || !endTime || !hourlyWage || !role || !branch) {
      alert("Not allowed to be empty");
      return;
    }

    initializeFirebase();

    const newShift = {
      userId,
      date,
      startTime,
      endTime,
      hourlyWage,
      role,
      branch,
      updateDate: Timestamp.now() // Add update date
    };

    try {
      await addDoc(collection(db, "shifts"), newShift);
      alert("Shift added successfully");

      // Get the number of shifts for the current month
      const shiftsThisMonth = await getShiftsThisMonth(userId);
      const remainingShifts = 20 - shiftsThisMonth; // Assuming the monthly challenge requires at least 20 shifts
      if (remainingShifts === 0) {
        alert("Congratulations! You completed the monthly challenge!");
      } else if (remainingShifts > 0) {
        alert(`You need ${remainingShifts} more shifts for completing the monthly challenge`);
      }

      window.location.href = "/pages/view-shifts.html";
    } catch (error) {
      console.error("Error adding shift: ", error);
      alert("Something went wrong!");
    }
  });
});
