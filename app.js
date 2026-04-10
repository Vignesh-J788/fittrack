let stepGoal = 10000;
let calGoal = 500;

// GET USER DATA
let user = JSON.parse(localStorage.getItem("userData")) || {};
let name = user.name || "User";

document.getElementById("greeting").innerText = "Hello, " + name + " 👋";

let steps = user.steps || 0;
let calories = user.calories || 0;
let duration = user.duration || 0;
let weight = user.weight || 0;
let height = user.height || 1;

// UPDATE RINGS
updateRing("stepsRing", "stepsValue", steps, stepGoal, "#00f2fe");
updateRing("calRing", "calValue", calories, calGoal, "#ff4ecd");

// REMAINING
document.getElementById("stepsRemain").innerText =
    "Remaining: " + Math.max(stepGoal - steps, 0);

document.getElementById("calRemain").innerText =
    "Remaining: " + Math.max(calGoal - calories, 0);

// BMI
let bmi = (weight / (height * height)).toFixed(2);

let status = "";
if (bmi < 18.5) status = "Underweight";
else if (bmi < 25) status = "Good";
else if (bmi < 30) status = "Overweight";
else status = "Obese";

document.getElementById("bmiValue").innerText = bmi + " (" + status + ")";

// Duration
document.getElementById("durValue").innerText = duration + " min";

// RING FUNCTION (ONLY BORDER ARC)
function updateRing(ringId, textId, value, goal, color) {

    let percent = Math.min((value / goal) * 100, 100);
    let deg = percent * 3.6;

    let ring = document.getElementById(ringId);

    ring.style.background =
        `conic-gradient(${color} ${deg}deg, rgba(255,255,255,0.1) ${deg}deg)`;

    document.getElementById(textId).innerText = value;
}

// HISTORY (MULTI USER)
let key = "history_" + name;
let history = JSON.parse(localStorage.getItem(key)) || [];

history.push({ steps, calories });

if (history.length > 7) history.shift();

localStorage.setItem(key, JSON.stringify(history));

// GRAPH DATA
let labels = history.map((_, i) => "Day " + (i + 1));
let stepsData = history.map(d => d.steps);
let calData = history.map(d => d.calories);

// STEPS GRAPH
new Chart(document.getElementById("stepsChart"), {
    type: "line",
    data: {
        labels,
        datasets: [{
            data: stepsData,
            borderColor: "#00f2fe",
            tension: 0.4
        }]
    }
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});

// CALORIES GRAPH
new Chart(document.getElementById("calChart"), {
    type: "line",
    data: {
        labels,
        datasets: [{
            data: calData,
            borderColor: "#ff4ecd",
            tension: 0.4
        }]
    }
    options: {
        responsive: true,
        maintainAspectRatio: false
    }
});
