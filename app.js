// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyARqj0_tnZoO5YDAVPxQeMh5KhhECo8J38",
  databaseURL: "https://virtual-esp32-monitor-2dbca-default-rtdb.asia-southeast1.firebasedatabase.app/"
};
firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// Live data
db.ref("/live").on("value", snapshot => {
  const data = snapshot.val();
  if (data) {
    document.getElementById("temp").textContent = data.temperature.toFixed(1);
    document.getElementById("hum").textContent = data.humidity.toFixed(1);
    document.getElementById("lux").textContent = data.light.toFixed(1);
    document.getElementById("uv").textContent = data.uv.toFixed(2);
  }
});

// Chart setup
function createChart(ctx, labelX) {
  return new Chart(ctx, {
    type: "line",
    data: {
      labels: [],
      datasets: [
        { label: "Temp (°C)", data: [], borderColor: "red", fill: false },
        { label: "Hum (%)", data: [], borderColor: "blue", fill: false },
        { label: "Light", data: [], borderColor: "orange", fill: false },
        { label: "UV", data: [], borderColor: "green", fill: false }
      ]
    },
    options: {
      responsive: true,
      scales: { x: { title: { display: true, text: labelX } }, y: { beginAtZero: true } }
    }
  });
}

const hourlyChart = createChart(document.getElementById("hourlyChart").getContext("2d"), "Hour");
const dailyChart = createChart(document.getElementById("dailyChart").getContext("2d"), "Day");

function updateChart(chart, labels, temp, hum, lux, uv) {
  chart.data.labels = labels;
  chart.data.datasets[0].data = temp;
  chart.data.datasets[1].data = hum;
  chart.data.datasets[2].data = lux;
  chart.data.datasets[3].data = uv;
  chart.update();
}

// Fetch hourly summary
db.ref("/summary/hourly").on("value", snapshot => {
  const data = snapshot.val();
  if (!data) return;

  const labels = [], tempData = [], humData = [], luxData = [], uvData = [];

  for (const year in data)
    for (const month in data[year])
      for (const day in data[year][month])
        for (const hour in data[year][month][day]) {
          const item = data[year][month][day][hour];
          labels.push(`${day}/${month} ${hour}h`);
          tempData.push(item.temperature);
          humData.push(item.humidity);
          luxData.push(item.light);
          uvData.push(item.uv);
        }

  updateChart(hourlyChart, labels, tempData, humData, luxData, uvData);
});

// Fetch daily summary
db.ref("/summary/daily").on("value", snapshot => {
  const data = snapshot.val();
  if (!data) return;

  const labels = [], tempData = [], humData = [], luxData = [], uvData = [];

  for (const year in data)
    for (const month in data[year])
      for (const day in data[year][month]) {
        const item = data[year][month][day];
        labels.push(`${day}/${month}`);
        tempData.push(item.temperature);
        humData.push(item.humidity);
        luxData.push(item.light);
        uvData.push(item.uv);
      }

  updateChart(dailyChart, labels, tempData, humData, luxData, uvData);
});