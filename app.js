import { initializeApp } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-app.js";
import { getDatabase, ref, query, limitToLast, get } from "https://www.gstatic.com/firebasejs/10.14.1/firebase-database.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCXPKH38aynV0p4fBpPOHjcA81CpCHQvZI",
  authDomain: "arduinor3sensordata.firebaseapp.com",
  databaseURL: "https://arduinor3sensordata-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "arduinor3sensordata",
  storageBucket: "arduinor3sensordata.appspot.com",
  messagingSenderId: "159954589479",
  appId: "1:159954589479:web:fda6a524de2a28c77dfb02",
  measurementId: "G-M9WFFX99E8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// Function to update the latest data
function updateLatestData(data) {
    var latestDataDiv = document.getElementById('latestData');
    latestDataDiv.innerHTML = `
        <div class="sensor-card">
            <h2>Latest Reading</h2>
            <p><strong>Name:</strong> ${data.name || 'Unknown'}</p>
            <p><strong>Heart Rate:</strong> ${data.heartRate} BPM</p>
            <p><strong>Status:</strong> ${data.status || 'N/A'}</p>
            <p><strong>Humidity:</strong> ${data.humidity}%</p>
            <p><strong>Temperature:</strong> ${data.temperatureC}°C / ${data.temperatureF}°F</p>
            <p><strong>Heat Index:</strong> ${data.heatIndexC}°C / ${data.heatIndexF}°F</p>
        </div>
    `;
}

// Function to update the history table
function updateHistoryTable(dataArray) {
    var historyDataDiv = document.getElementById('historyData');
    var tableHTML = `
        <table>
            <tr>
                <th>Name</th>
                <th>Heart Rate</th>
                <th>Status</th>
                <th>Humidity</th>
                <th>Temperature</th>
                <th>Heat Index</th>
            </tr>
    `;
    dataArray.forEach(data => {
        tableHTML += `
            <tr>
                <td>${data.name || 'Unknown'}</td>
                <td>${data.heartRate} BPM</td>
                <td>${data.status || 'N/A'}</td>
                <td>${data.humidity}%</td>
                <td>${data.temperatureC}°C / ${data.temperatureF}°F</td>
                <td>${data.heatIndexC}°C / ${data.heatIndexF}°F</td>
            </tr>
        `;
    });
    tableHTML += '</table>';
    historyDataDiv.innerHTML = tableHTML;
}

// Updated function to generate recommendations
function generateRecommendations(data) {
    let recommendations = [];

    // Heart rate recommendations
    if (data.heartRate >= 206 && data.heartRate <= 246) {
        recommendations.push("URGENT: Your heart rate indicates a potential heart attack. Seek immediate medical attention!");
        recommendations.push("If available, take aspirin as it can help reduce heart damage.");
        recommendations.push("Try to remain calm and seated until medical help arrives.");
    } else if (data.heartRate >= 248 && data.heartRate <= 288) {
        recommendations.push("Your heart rate is within the normal range. Keep up your healthy lifestyle!");
        recommendations.push("Regular exercise and a balanced diet can help maintain a healthy heart rate.");
    } else if (data.heartRate >= 289 && data.heartRate <= 328) {
        recommendations.push("Your heart rate indicates stress. Try some deep breathing exercises to calm down.");
        recommendations.push("Consider taking a short break from your current activity to relax.");
        recommendations.push("Practicing mindfulness or meditation can help reduce stress levels.");
    } else if (data.heartRate >= 329 && data.heartRate <= 388) {
        recommendations.push("Your heart rate suggests anxiety. Try to identify and address the source of your anxiety.");
        recommendations.push("Practice relaxation techniques such as progressive muscle relaxation.");
        recommendations.push("If anxiety persists, consider speaking with a mental health professional.");
    } else {
        recommendations.push("Your heart rate is outside the typical ranges. Consider rechecking your measurement or consulting a healthcare provider.");
    }

    // Temperature recommendations
    if (data.temperatureC > 30) {
        recommendations.push("It's hot! Stay hydrated and avoid prolonged exposure to heat.");
    } else if (data.temperatureC < 10) {
        recommendations.push("It's cold. Dress warmly and maintain indoor heating.");
    }

    // Humidity recommendations
    if (data.humidity < 30) {
        recommendations.push("The humidity is low. Consider using a humidifier to improve air quality.");
    } else if (data.humidity > 60) {
        recommendations.push("The humidity is high. Use a dehumidifier or air conditioning to reduce moisture in the air.");
    }

    // Heat index recommendations
    if (data.heatIndexC > 32) {
        recommendations.push("The heat index is high. Take precautions to avoid heat-related illnesses.");
    }

    return recommendations;
}

// Function to update the recommendations
function updateRecommendations(data) {
    const recommendationsDiv = document.getElementById('recommendations');
    const recommendations = generateRecommendations(data);

    if (recommendations.length > 0) {
        let html = '<h2>Recommendations</h2><ul>';
        recommendations.forEach(rec => {
            html += `<li>${rec}</li>`;
        });
        html += '</ul>';
        recommendationsDiv.innerHTML = html;
    } else {
        recommendationsDiv.innerHTML = '';
    }
}

// Function to fetch and display data
function fetchAndDisplayData() {
    const sensorDataRef = ref(database, 'sensor_data');
    const latestDataQuery = query(sensorDataRef, limitToLast(1));

    get(latestDataQuery).then((snapshot) => {
        if (snapshot.exists()) {
            const data = Object.values(snapshot.val())[0];
            updateLatestData(data);
            updateRecommendations(data);
        }
    }).catch((error) => {
        console.error("Error fetching latest data:", error);
    });

    const historicalDataQuery = query(sensorDataRef, limitToLast(10));

    get(historicalDataQuery).then((snapshot) => {
        if (snapshot.exists()) {
            const dataArray = Object.values(snapshot.val()).reverse();
            updateHistoryTable(dataArray);
        }
    }).catch((error) => {
        console.error("Error fetching historical data:", error);
    });
}

// Initial data fetch
fetchAndDisplayData();

// Set up interval to fetch and display data every 5 seconds
setInterval(fetchAndDisplayData, 5000);