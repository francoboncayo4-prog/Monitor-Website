/* Firebase config */
const firebaseConfig = {
  apiKey: "AIzaSyARqj0_tnZoO5YDAVPxQeMh5KhhECo8J38",
  authDomain: "virtual-esp32-monitor-2dbca.firebaseapp.com",
  databaseURL: "https://virtual-esp32-monitor-2dbca-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "virtual-esp32-monitor-2dbca",
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

/* Navigation */
document.querySelectorAll(".nav-btn").forEach(btn => {
  btn.onclick = () => {
    document.querySelectorAll(".nav-btn").forEach(b => b.classList.remove("active"));
    document.querySelectorAll(".tab").forEach(t => t.classList.remove("active-tab"));

    btn.classList.add("active");
    document.getElementById(btn.dataset.tab).classList.add("active-tab");
  };
});

/* Live elements */
const tempEl = document.getElementById("live-temp");
const humEl = document.getElementById("live-hum");
const uvEl = document.getElementById("live-uv");
const lightEl = document.getElementById("live-light");

/* Live chart */
const liveChart = new Chart(document.getElementById("liveChart"), {
  type: "line",
  data: {
    labels: [],
    datasets: [
      { label: "Temp", data: [] },
      { label: "Hum", data: [] },
      { label: "UV", data: [] },
      { label: "Light", data: [] }
    ]
  }
});

/* Live listener */
db.ref("sensor").on("value", snap => {
  const v = snap.val();
  if (!v) return;

  tempEl.textContent = v.temperature + " °C";
  humEl.textContent = v.humidity + " %";
  uvEl.textContent = v.uv;
  lightEl.textContent = v.light + " lux";

  const time = new Date().toLocaleTimeString();
  liveChart.data.labels.push(time);

  liveChart.data.datasets[0].data.push(v.temperature);
  liveChart.data.datasets[1].data.push(v.humidity);
  liveChart.data.datasets[2].data.push(v.uv);
  liveChart.data.datasets[3].data.push(v.light);

  if (liveChart.data.labels.length > 20) {
    liveChart.data.labels.shift();
    liveChart.data.datasets.forEach(d => d.data.shift());
  }

  liveChart.update();
});

/* Simulation */
let sim;
document.getElementById("startSim").onclick = () => {
  sim = setInterval(() => {
    db.ref("sensor").set({
      temperature: (20 + Math.random() * 10).toFixed(1),
      humidity: (50 + Math.random() * 30).toFixed(1),
      uv: (Math.random() * 10).toFixed(1),
      light: (100 + Math.random() * 900).toFixed(0)
    });
  }, 5000);
};

document.getElementById("stopSim").onclick = () => clearInterval(sim);
