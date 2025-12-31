// ===== Firebase Config =====
const firebaseConfig = {
  apiKey: "AIzaSyARqj0_tnZoO5YDAVPxQeMh5KhhECo8J38",
  databaseURL: "https://virtual-esp32-monitor-2dbca-default-rtdb.asia-southeast1.firebasedatabase.app/"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== Navigation =====
function showSection(id) {
  document.querySelectorAll(".section").forEach(sec => sec.classList.add("hidden"));
  document.getElementById(id).classList.remove("hidden");
}

// ===== Live Data =====
db.ref("/live").on("value", snap => {
  const d = snap.val();
  if (!d) return;
  temp.textContent = d.temperature.toFixed(1);
  hum.textContent = d.humidity.toFixed(1);
  lux.textContent = d.light.toFixed(1);
  uv.textContent = d.uv.toFixed(2);
});

// ===== Charts =====
function createChart(ctx, label) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [{
        label,
        data: [],
        borderColor: "red",
        fill: false
      }]
    },
    options: { responsive: true }
  });
}

const hourlyChart = createChart(
  document.getElementById("hourlyChart").getContext("2d"),
  "Hourly Avg"
);

const dailyChart = createChart(
  document.getElementById("dailyChart").getContext("2d"),
  "Daily Avg"
);

// ===== History =====
db.ref("/history").limitToLast(20).on("value", snap => {
  historyList.innerHTML = "";
  snap.forEach(child => {
    const li = document.createElement("li");
    li.textContent = JSON.stringify(child.val());
    historyList.prepend(li);
  });
});
