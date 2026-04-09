let stepGoal = 10000;
let calGoal = 500;

// GET USER
let user = JSON.parse(localStorage.getItem("userData")) || {};
let username = user.name || "guest";

document.getElementById("greeting").innerText =
    "Hello, " + username + " 👋";

let steps = user.steps || 0;
let calories = user.calories || 0;
let duration = user.duration || 0;
let weight = user.weight || 0;
let height = user.height || 1;

// UPDATE RINGS
updateRing("stepsRing", steps, stepGoal);
updateRing("calRing", calories, calGoal);

// REMAINING
document.getElementById("stepsRemain").innerText =
    "Remaining: " + Math.max(stepGoal - steps, 0);

document.getElementById("calRemain").innerText =
    "Remaining: " + Math.max(calGoal - calories, 0);

// BMI
let bmi = (weight / (height * height)).toFixed(2);
document.getElementById("bmiValue").innerText = bmi;

// Duration
document.getElementById("durValue").innerText = duration + " min";

// COMMENTS
function getComment(percent) {
    if (percent >= 100) return "Amazing! 🚀";
    else if (percent >= 70) return "Awesome! 🔥";
    else if (percent >= 30) return "Keep going! 💪";
    else return "Start moving! ⚡";
}

let stepPercent = (steps / stepGoal) * 100;
let calPercent = (calories / calGoal) * 100;

document.getElementById("stepsComment").innerText =
    "Steps: " + getComment(stepPercent);

document.getElementById("calComment").innerText =
    "Calories: " + getComment(calPercent);

// RING FUNCTION
function updateRing(id, value, goal) {
    let percent = Math.min((value / goal) * 100, 100);

    let ring = document.getElementById(id);
    ring.innerText = value;

    ring.style.background =
        `conic-gradient(#00f2fe ${percent}%, rgba(255,255,255,0.2) ${percent}%)`;
}

// USER-SPECIFIC HISTORY
let historyKey = "history_" + username;

let history = JSON.parse(localStorage.getItem(historyKey)) || [];

history.push({ steps: steps, calories: calories });

if (history.length > 7) history.shift();

localStorage.setItem(historyKey, JSON.stringify(history));

// GRAPH DATA
let labels = history.map((_, i) => "Day " + (i + 1));
let stepsData = history.map(d => d.steps);
let calData = history.map(d => d.calories);

// STEPS GRAPH
new Chart(document.getElementById("stepsChart"), {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            data: stepsData,
            borderColor: "#00f2fe",
            tension: 0.4
        }]
    }
});

// CALORIES GRAPH
new Chart(document.getElementById("calChart"), {
    type: "line",
    data: {
        labels: labels,
        datasets: [{
            data: calData,
            borderColor: "#ff4ecd",
            tension: 0.4
        }]
    }
});

// STREAK
document.getElementById("streak").innerText =
    "🔥 Streak: " + history.length + " days";