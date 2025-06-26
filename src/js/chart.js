// Chart logic for JetLag: Shoot the Gap SPA
// Visualizes the win/draw/loss probabilities for the Snaker and the Blocker probability distribution
// Left chart: For each possible Snaker move, shows the chance of winning, drawing, or losing (middle value logic)
// Right chart: Shows the probability distribution for a single Blocker (how likely they are to collect n items)
import { calculateResults, yPlayerProbabilities } from "./probability.js";

// Update the main chart with new win/draw/lose data for the Snaker
export function updateChart(chart, SIZE, PROB, model) {
	const { win, draw, lose } = calculateResults(SIZE, PROB, model);
	chart.data.labels = Array.from({ length: win.length }, (_, i) => i);
	chart.data.datasets[0].data = win;
	chart.data.datasets[1].data = draw;
	chart.data.datasets[2].data = lose;
	chart.update();
	updateLegend(win, draw);
}

// Update the legend to show the best move for the Snaker (highest win%, then draw%)
export function updateLegend(winArr, drawArr) {
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
	).innerHTML = `Best move for snaker: <b>${maxX}</b> with the winning percentage of <b>${maxWin.toFixed(
		2
	)}%</b> and draw percentage of <b>${maxDraw.toFixed(2)}%</b>`;
}

// Create the main chart (left): win/draw/lose for each Snaker move
export function createMainChart(ctx, win, draw, lose) {
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
					pointRadius: 0,
					pointHoverRadius: 0,
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

// Create or update the Blocker probability chart (right): shows the distribution for a single Blocker
export function createOrUpdateYProbChart(yProbChart, SIZE, PROB, model, AUTOSCALE_Y_PROB_CHART) {
	const yProb = yPlayerProbabilities(SIZE, PROB, model);
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
						mode: "index",
						intersect: false,
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
