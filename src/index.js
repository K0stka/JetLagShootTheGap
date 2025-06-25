// JetLagS14 SPA logic for browser

// --- Probability Model Flag ---
let USE_BINOMIAL = true; // Set to false for exponential decay

// --- Feature Flags ---
const AUTOSCALE_Y_PROB_CHART = false; // Set to false to disable autoscaling of the yProbChart

// --- Utility Functions ---
function binom(n, k) {
	if (k < 0 || k > n) return 0;
	if (k === 0 || k === n) return 1;
	k = Math.min(k, n - k); // Use symmetry
	let res = 1;
	for (let i = 1; i <= k; i++) {
		res = (res * (n - i + 1)) / i;
	}
	return res;
}

// --- Core Evaluation Logic ---
function evaluate(x, y, z) {
	const min = Math.min(y, z);
	const max = Math.max(y, z);
	if (x > min && x < max) return 1; // win
	if (x < min || x > max) return -1; // loss
	return 0; // draw
}

function probability(n, k, PROB) {
	if (USE_BINOMIAL) {
		return binom(n, k) * Math.pow(PROB, k) * Math.pow(1 - PROB, n - k);
	} else {
		return Math.pow(PROB, k); // Exponential decay (not normalized)
	}
}

function calculateResults(SIZE, PROB) {
	const win = new Float64Array(SIZE + 1);
	const draw = new Float64Array(SIZE + 1);
	const lose = new Float64Array(SIZE + 1);

	// Precompute all probabilities for efficiency
	const probCache = new Float64Array(SIZE + 1);
	for (let i = 0; i <= SIZE; i++) {
		probCache[i] = probability(SIZE, i, PROB);
	}

	for (let x = 0; x <= SIZE; x++) {
		let w = 0,
			l = 0,
			d = 0,
			total = 0;
		for (let y = 0; y <= SIZE; y++) {
			const probY = probCache[y];
			for (let z = 0; z <= SIZE; z++) {
				const result = evaluate(x, y, z);
				const probZ = probCache[z];
				const prob = probY * probZ;
				if (result === 1) w += prob;
				else if (result === -1) l += prob;
				else d += prob;
				total += prob;
			}
		}
		win[x] = (w / total) * 100;
		draw[x] = (d / total) * 100;
		lose[x] = (l / total) * 100;
	}
	return { win, draw, lose };
}

function yPlayerProbabilities(SIZE, PROB) {
	const probs = new Float64Array(SIZE + 1);
	let total = 0;
	for (let n = 0; n <= SIZE; n++) {
		probs[n] = probability(SIZE, n, PROB);
		total += probs[n];
	}
	// Normalize and convert to percentage
	for (let n = 0; n <= SIZE; n++) {
		probs[n] = (probs[n] / total) * 100;
	}
	return probs;
}

// --- Chart Logic ---
function updateChart(chart, SIZE, PROB) {
	const { win, draw, lose } = calculateResults(SIZE, PROB);
	chart.data.labels = Array.from({ length: win.length }, (_, i) => i);
	chart.data.datasets[0].data = win;
	chart.data.datasets[1].data = draw;
	chart.data.datasets[2].data = lose;
	chart.update();
	updateLegend(win, draw);
}

function updateLegend(winArr, drawArr) {
	let maxWin = -1,
		maxDraw = -1,
		maxX = -1;
	for (let i = 0; i < winArr.length; i++) {
		if (winArr[i] > maxWin || (winArr[i] === maxWin && drawArr[i] > maxDraw)) {
			maxWin = winArr[i];
			maxDraw = drawArr[i];
			maxX = i;
		}
	}
	document.getElementById(
		"legend"
	).innerHTML = `Best move for snaker: <b>${maxX}</b> with the winning percentage of <b>${
		Math.round(maxWin * 100) / 100
	}%</b> and draw percentage of <b>${Math.round(maxDraw * 100) / 100}%</b>`;
}

function createMainChart(ctx, win, draw, lose) {
	return new Chart(ctx, {
		type: "line",
		data: {
			labels: Array.from({ length: win.length }, (_, i) => i),
			datasets: [
				{
					label: "Winning Percentage",
					data: win,
					borderColor: "#84cc16",
					backgroundColor: "rgba(132, 204, 22, 0.15)",
					fill: true,
					tension: 0.1,
					pointRadius: 0, // <-- Remove dots
					pointHoverRadius: 0, // <-- Remove hover dots
				},
				{
					label: "Draw Percentage",
					data: draw,
					borderColor: "#fbbf24",
					backgroundColor: "rgba(251, 191, 36, 0.15)",
					fill: true,
					tension: 0.1,
					pointRadius: 0,
					pointHoverRadius: 0,
				},
				{
					label: "Lose Percentage",
					data: lose,
					borderColor: "#ef4444",
					backgroundColor: "rgba(239, 68, 68, 0.15)",
					fill: true,
					tension: 0.1,
					pointRadius: 0,
					pointHoverRadius: 0,
				},
			],
		},
		options: {
			responsive: true,
			plugins: {
				legend: { display: true },
				tooltip: {
					mode: "index",
					intersect: false,
					callbacks: {
						title: (context) => (context.length > 0 ? `Snaker's move: ${context[0].label}` : ""),
						label: (context) => {
							const label = context.dataset.label || "";
							const value = context.parsed.y != null ? context.parsed.y.toFixed(2) : "";
							let explanation = "";
							if (label.includes("Winning")) explanation = " (win)";
							else if (label.includes("Draw")) explanation = " (draw)";
							else if (label.includes("Lose")) explanation = " (lose)";
							return `${label}: ${value}%${explanation}`;
						},
					},
				},
			},
			scales: {
				x: {},
				y: { beginAtZero: true, max: 100 },
			},
		},
	});
}

function createOrUpdateYProbChart(yProbChart, SIZE, PROB) {
	const yProb = yPlayerProbabilities(SIZE, PROB);
	const maxY = Math.max(...yProb);

	if (!yProbChart.chart) {
		const yProbCtx = document.getElementById("yProbChart").getContext("2d");
		yProbChart.chart = new Chart(yProbCtx, {
			type: "bar",
			data: {
				labels: Array.from({ length: yProb.length }, (_, i) => i),
				datasets: [
					{
						data: yProb,
						backgroundColor: "#fbbf24",
						borderColor: "#f59e42",
						borderWidth: 1,
					},
				],
			},
			options: {
				responsive: true,
				plugins: {
					legend: { display: false },
					tooltip: {
						mode: "index", // Show tooltip for all bars at the hovered x
						intersect: false, // Show tooltip even if not directly over a bar
						callbacks: {
							label: (context) => `${context.parsed.y.toFixed(2)}%`,
						},
					},
				},
				scales: {
					x: {},
					y: {
						beginAtZero: true,
						max: AUTOSCALE_Y_PROB_CHART ? maxY : 100,
						ticks: {
							callback: function (value) {
								return value.toFixed(2) + "%";
							},
						},
					},
				},
			},
		});
	} else {
		yProbChart.chart.data.labels = Array.from({ length: yProb.length }, (_, i) => i);
		yProbChart.chart.data.datasets[0].data = yProb;
		yProbChart.chart.options.scales.y.max = AUTOSCALE_Y_PROB_CHART ? maxY : 100;
		yProbChart.chart.update();
	}
}

// --- Theme Toggle and Legend Styling ---
function setupThemeToggle() {
	const toggle = document.getElementById("dark-toggle");
	const iconSun = document.getElementById("icon-sun");
	const iconMoon = document.getElementById("icon-moon");
	function updateIcon() {
		if (document.documentElement.classList.contains("dark")) {
			iconSun.style.removeProperty("display");
			iconMoon.style.setProperty("display", "none", "important");
		} else {
			iconSun.style.setProperty("display", "none", "important");
			iconMoon.style.removeProperty("display");
		}
	}
	updateIcon();
	toggle.addEventListener("click", () => {
		document.documentElement.classList.toggle("dark");
		updateIcon();
	});
}

// --- Main App Initialization ---
window.addEventListener("DOMContentLoaded", () => {
	const sizeInput = document.getElementById("size");
	const probInput = document.getElementById("prob");
	const sizeValue = document.getElementById("size-value");
	const probValue = document.getElementById("prob-value");
	const modelSelect = document.getElementById("model");

	// Set initial dropdown value based on USE_BINOMIAL
	modelSelect.value = USE_BINOMIAL ? "binomial" : "exponential";

	let SIZE = parseInt(sizeInput.value, 10);
	let PROB = parseFloat(probInput.value) / 100;

	const { win, draw, lose } = calculateResults(SIZE, PROB);
	const ctx = document.getElementById("myChart").getContext("2d");
	const chart = createMainChart(ctx, win, draw, lose);

	const yProbChart = {};
	createOrUpdateYProbChart(yProbChart, SIZE, PROB);

	sizeInput.addEventListener("input", function () {
		SIZE = parseInt(this.value, 10);
		PROB = parseFloat(probInput.value) / 100;
		updateChart(chart, SIZE, PROB);
		sizeValue.textContent = this.value;
		createOrUpdateYProbChart(yProbChart, SIZE, PROB);
	});
	probInput.addEventListener("input", function () {
		SIZE = parseInt(sizeInput.value, 10);
		PROB = parseFloat(this.value) / 100;
		updateChart(chart, SIZE, PROB);
		probValue.textContent = this.value + "%";
		createOrUpdateYProbChart(yProbChart, SIZE, PROB);
	});
	modelSelect.addEventListener("change", function () {
		USE_BINOMIAL = this.value === "binomial";
		updateChart(chart, SIZE, PROB);
		createOrUpdateYProbChart(yProbChart, SIZE, PROB);
	});

	updateLegend(win, draw);
	setupThemeToggle();
});
