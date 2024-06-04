import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  doc
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
const db = getFirestore(app);

async function getShiftsFromFirestore(userId) {
  try {
    const q = query(collection(db, "shifts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const shifts = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    console.log("Fetched shifts: ", shifts);
    return shifts;
  } catch (error) {
    console.error("Error getting shifts from Firestore:", error);
    return [];
  }
}

async function deleteShift(shiftId) {
  try {
    await deleteDoc(doc(db, "shifts", shiftId));
    await displayShifts(); // טען מחדש את המשמרות לאחר המחיקה
  } catch (error) {
    console.error("Error deleting shift: ", error);
  }
}

async function displayShifts() {
  const userId = localStorage.getItem("userId");
  const shifts = await getShiftsFromFirestore(userId);

  console.log("Shifts to display: ", shifts);

  const shiftsTable = document.getElementById('shifts-table');
  if (!shiftsTable) {
    console.error('Shifts table element not found');
    return;
  }

  const shiftsTableBody = shiftsTable.querySelector('tbody');
  if (!shiftsTableBody) {
    console.error('Shifts table body element not found');
    return;
  }

  shiftsTableBody.innerHTML = ''; // נקה את הטבלה לפני הוספת המשמרות

  shifts.forEach(shift => {
    console.log("Adding shift: ", shift);
    const row = shiftsTableBody.insertRow();
    row.insertCell(0).innerText = shift.startTime || '';
    row.insertCell(1).innerText = shift.endTime || '';
    row.insertCell(2).innerText = shift.hourlyWage || '';
    row.insertCell(3).innerText = shift.role || '';
    row.insertCell(4).innerText = shift.branch || '';
    row.insertCell(5).innerText = shift.shiftDate && shift.shiftDate.seconds
      ? new Date(shift.shiftDate.seconds * 1000).toLocaleDateString()
      : 'N/A';
    const deleteButton = document.createElement('button');
    deleteButton.innerText = 'מחק';
    deleteButton.onclick = () => deleteShift(shift.id);
    row.insertCell(6).appendChild(deleteButton);
  });

  console.log("Shifts displayed successfully");
}

document.addEventListener('DOMContentLoaded', displayShifts);