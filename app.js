let stepGoal = 10000;
let calGoal = 500;

// USER DATA
let user = JSON.parse(localStorage.getItem("userData")) || {};
let username = user.name || "User";

document.getElementById("greeting").innerText =
    "Hello, " + username + " 👋";

// DISPLAY GOALS
document.getElementById("stepGoalText").innerText =
    "Goal: " + stepGoal + " steps";

document.getElementById("calGoalText").innerText =
    "Goal: " + calGoal + " calories";

// VALUES
let steps = user.steps || 0;
let calories = user.calories || 0;
let duration = user.duration || 0;
let weight = user.weight || 0;
let height = user.height || 1;

// RINGS
updateRing("stepsRing", steps, stepGoal, "#00f2fe"); // cyan
updateRing("calRing", calories, calGoal, "#ff4ecd"); // pink

// Duration (solid progress)
updateRing("durRing", duration, 60, "#4facfe");

// BMI (use max 30 as reference)
updateRing("bmiRing", bmi, 30, "#22c55e");

// REMAINING
document.getElementById("stepsRemain").innerText =
    "Remaining: " + Math.max(stepGoal - steps, 0);

document.getElementById("calRemain").innerText =
    "Remaining: " + Math.max(calGoal - calories, 0);

// BMI
let bmi = (weight / (height * height)).toFixed(2);

let status = "";

if (bmi < 18.5) status = "Underweight ⚠️";
else if (bmi < 25) status = "Good 👍";
else if (bmi < 30) status = "Overweight ⚠️";
else status = "Obese ❌";

document.getElementById("bmiValue").innerText =
    bmi + " (" + status + ")";
let bmiText = document.getElementById("bmiValue");

if (bmi < 18.5) bmiText.style.color = "#facc15";
else if (bmi < 25) bmiText.style.color = "#22c55e";
else if (bmi < 30) bmiText.style.color = "#f97316";
else bmiText.style.color = "#ef4444";

// Duration
document.getElementById("durValue").innerText = duration + " min";

// COMMENTS
function getComment(percent) {
    if (percent >= 100) return "Amazing! 🚀";
    else if (percent >= 70) return "Awesome! 🔥";
    else if (percent >= 30) return "Keep going! 💪";
    else return "Start moving! ⚡";
}

document.getElementById("stepsComment").innerText =
    "Steps: " + getComment((steps / stepGoal) * 100);

document.getElementById("calComment").innerText =
    "Calories: " + getComment((calories / calGoal) * 100);

// RING FUNCTION
function updateRing(id, value, goal, color) {

    let percent = Math.min((value / goal) * 100, 100);
    let deg = percent * 3.6; // convert % to degrees

    let ring = document.getElementById(id);
    ring.innerText = value;

    ring.style.setProperty("--percent", deg + "deg");
    ring.style.setProperty("--color", color);
}

// MULTI-USER HISTORY
let historyKey = "history_" + username;
let history = JSON.parse(localStorage.getItem(historyKey)) || [];

history.push({ steps, calories });

if (history.length > 7) history.shift();

localStorage.setItem(historyKey, JSON.stringify(history));

// GRAPH DATA
let labels = history.map((_, i) => "Day " + (i + 1));
let stepsData = history.map(d => d.steps);
let calData = history.map(d => d.calories);

// CHARTS
new Chart(document.getElementById("stepsChart"), {
    type: "line",
    data: {
        labels,
        datasets: [{ data: stepsData, borderColor: "#00f2fe", tension: 0.4 }]
    }
});

new Chart(document.getElementById("calChart"), {
    type: "line",
    data: {
        labels,
        datasets: [{ data: calData, borderColor: "#ff4ecd", tension: 0.4 }]
    }
});

// STREAK
document.getElementById("streak").innerText =
    "🔥 Streak: " + history.length + " days";
