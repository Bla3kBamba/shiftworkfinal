import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
  addDoc,
  Timestamp
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

let app = null;
let db = null;

function initializeFirebase() {
  if (!app) {
    app = initializeApp(firebaseConfig);
    db = getAnalytics(app);
  }
}

async function addShift(userId, shiftData) {
  initializeFirebase();
  try {
    if (!userId) {
      console.error("User ID is not defined.");
      return;
    }
    const shiftWithDate = {
      ...shiftData,
      updateDate: Timestamp.now() 
    };
    await addDoc(collection(db, "shifts"), shiftWithDate);
    console.log("Shift added with update date");
  } catch (error) {
    console.error("Error adding shift: ", error);
  }
}

async function getShiftsFromFirestore(userId) {
  initializeFirebase();
  try {
    const q = query(collection(db, "shifts"), where("userId", "==", userId));
    const querySnapshot = await getDocs(q);
    const shifts = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return shifts;
  } catch (error) {
    console.error("Error getting shifts from Firestore:", error);
    return [];
  }
}

setInterval(updateMetrics, 60000);

function displayLastUpdateTime() {
  const lastUpdateTime = new Date();
  const lastUpdateTimeElement = document.getElementById("lastUpdateTime");
  if (lastUpdateTimeElement) {
    const formattedDate = `${String(lastUpdateTime.getDate()).padStart(2, "0")}/${String(lastUpdateTime.getMonth() + 1).padStart(2, "0")}/${lastUpdateTime.getFullYear()} ${lastUpdateTime.toLocaleTimeString()}`;
    lastUpdateTimeElement.innerText = `Last update: ${formattedDate}`;
  }
}

function getShiftsThisMonth(shifts) {
  if (!shifts || shifts.length === 0) return [];
  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  return shifts.filter(shift => {
    if (shift.updateDate && shift.updateDate.seconds) {
      const shiftDate = new Date(shift.updateDate.seconds * 1000);
      return shiftDate >= startOfMonth && shiftDate <= now;
    }
    return false;
  });
}

function calculateConsecutiveDays(shifts) {
  if (!shifts || shifts.length === 0) return 0;

  let consecutiveDays = 1;

  for (let i = 1; i < shifts.length; i++) {
    const currentDate = new Date(shifts[i].date);
    const prevDate = new Date(shifts[i - 1].date);

    const timeDiff = currentDate.getTime() - prevDate.getTime();
    const daysDiff = timeDiff / (1000 * 3600 * 24);

    if (daysDiff === 1) {
      consecutiveDays++;
    } else if (daysDiff > 1) {
      consecutiveDays = 1;
    }
  }

  return consecutiveDays;
}


async function updateMetrics() {
  initializeFirebase();
  const userId = localStorage.getItem("userId");
  if (!userId) {
    console.error("User ID is not defined.");
    return;
  }
  const shifts = await getShiftsFromFirestore(userId);
  console.log(shifts);

  let totalHourlyWages = 0;
  let totalShiftWages = 0;
  const branchCounts = {};
  const roleSalaries = {};

  for (let i = 0; i < shifts.length; i++) {
    const shift = shifts[i];
    totalHourlyWages += parseInt(shift.hourlyWage);

    const startTime = new Date(`2000-01-01T${shift.startTime}`);
    const endTime = new Date(`2000-01-01T${shift.endTime}`);
    const hoursWorked = (endTime - startTime) / (1000 * 60 * 60);
    const salaryForShift = Math.ceil(hoursWorked) * parseFloat(shift.hourlyWage);
    totalShiftWages += salaryForShift;

    if (shift.branch) {
      if (!branchCounts[shift.branch]) {
        branchCounts[shift.branch] = 0;
      }
      branchCounts[shift.branch]++;
    }

    if (shift.role) {
      if (!roleSalaries[shift.role]) {
        roleSalaries[shift.role] = 0;
      }
      roleSalaries[shift.role] += salaryForShift;
    }
  }

  const averageHourlyWage = totalHourlyWages / shifts.length;
  const averageShiftWage = totalShiftWages / shifts.length;
  const mostWorkedBranch = Object.keys(branchCounts).reduce((a, b) => branchCounts[a] > branchCounts[b] ? a : b, "N/A");
  const highestPayingRole = Object.keys(roleSalaries).reduce((a, b) => roleSalaries[a] > roleSalaries[b] ? a : b, "N/A");

  const shiftsThisMonth = getShiftsThisMonth(shifts);
  const consecutiveDays = calculateConsecutiveDays(shifts);

  document.getElementById("average-hourly-wage").innerText = averageHourlyWage.toFixed(1);
  document.getElementById("average-shift-wage").innerText = averageShiftWage.toFixed(1);
  document.getElementById("most-worked-branch").innerText = mostWorkedBranch;
  document.getElementById("highest-paying-role").innerText = highestPayingRole;
  document.getElementById("shiftsLastMonth").innerText = shiftsThisMonth.length;
  document.getElementById("consecutiveDays").innerText = consecutiveDays;

  displayLastUpdateTime();
}

document.addEventListener("DOMContentLoaded", updateMetrics);
