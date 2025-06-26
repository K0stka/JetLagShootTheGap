// JetLag: Shoot the Gap SPA main logic
// Handles app initialization, user input, and updates the charts/UI based on the game rules described in index.html

import { createMainChart, createOrUpdateYProbChart, updateChart, updateLegend } from "./chart.js";
import { calculateResults } from "./probability.js";
import { initializeUI } from "./ui.js";

// --- State ---
// PROB_MODEL: which probability model to use for Blocker/Snaker item collection
let PROB_MODEL = "poisson"; // "binomial", "exponential", "poisson", "uniform"
// AUTOSCALE_Y_PROB_CHART: whether to autoscale the Blocker probability chart (right)
let AUTOSCALE_Y_PROB_CHART = true;

// --- Main App Initialization ---
window.addEventListener("DOMContentLoaded", () => {
	// Get references to UI elements
	const sizeInput = document.getElementById("size");
	const probInput = document.getElementById("prob");
	const sizeValue = document.getElementById("size-value");
	const probValue = document.getElementById("prob-value");
	const modelSelect = document.getElementById("model");
	const probLabel = document.querySelector('label[for="prob"]');

	// Set initial dropdown value based on PROB_MODEL
	modelSelect.value = PROB_MODEL;

	// Autoscale toggle button logic (button is now in HTML)
	const autoscaleButton = document.getElementById("autoscale-toggle-btn");
	const iconOn = document.getElementById("icon-autoscale-on");
	const iconOff = document.getElementById("icon-autoscale-off");
	if (autoscaleButton && iconOn && iconOff) {
		// Set initial icon state
		iconOn.style.display = AUTOSCALE_Y_PROB_CHART ? "flex" : "none";
		iconOff.style.display = AUTOSCALE_Y_PROB_CHART ? "none" : "flex";
		autoscaleButton.addEventListener("click", function () {
			AUTOSCALE_Y_PROB_CHART = !AUTOSCALE_Y_PROB_CHART;
			iconOn.style.display = AUTOSCALE_Y_PROB_CHART ? "flex" : "none";
			iconOff.style.display = AUTOSCALE_Y_PROB_CHART ? "none" : "flex";
			createOrUpdateYProbChart(yProbChart, SIZE, PROB, PROB_MODEL, AUTOSCALE_Y_PROB_CHART);
		});
	}

	// Helper to update range UI and label for selected probability model
	// This lets the user select the number of items and probability, depending on the model
	function updateRangeUI(model) {
		if (model === "binomial") {
			sizeInput.min = 5;
			sizeInput.max = 100;
			sizeInput.step = 1;
			probInput.min = 0;
			probInput.max = 100;
			probInput.step = 1;
			probInput.disabled = false;
			sizeInput.disabled = false;
			probLabel.childNodes[0].textContent = "Probability of collecting an item: ";
		} else if (model === "exponential") {
			sizeInput.min = 1;
			sizeInput.max = 100;
			sizeInput.step = 1;
			probInput.min = 0;
			probInput.max = 100;
			probInput.step = 1;
			probInput.disabled = false;
			sizeInput.disabled = false;
			probLabel.childNodes[0].textContent = "Decay probability per item: 1 - ";
		} else if (model === "poisson") {
			sizeInput.min = 1;
			sizeInput.max = 100;
			sizeInput.step = 1;
			probInput.min = 0;
			probInput.max = 200;
			probInput.step = 1;
			probInput.disabled = false;
			sizeInput.disabled = false;
			probLabel.childNodes[0].textContent = "Expected value (λ = n × p) as %: ";
		} else if (model === "uniform") {
			sizeInput.min = 1;
			sizeInput.max = 100;
			sizeInput.step = 1;
			probInput.value = 100;
			probInput.disabled = true;
			sizeInput.disabled = false;
			probLabel.childNodes[0].textContent = "Probability: (always uniform) ";
		}
		// Update displayed values
		sizeValue.textContent = sizeInput.value;
		probValue.textContent = probInput.value + "%";
	}

	// Initial values for number of items and probability
	let SIZE = parseInt(sizeInput.value, 10);
	let PROB = parseFloat(probInput.value) / 100;

	// Calculate initial win/draw/lose probabilities for the Snaker
	const { win, draw, lose } = calculateResults(SIZE, PROB, PROB_MODEL);
	// Create the main chart (left)
	const ctx = document.getElementById("myChart").getContext("2d");
	const chart = createMainChart(ctx, win, draw, lose);

	// Create the Blocker probability chart (right)
	const yProbChart = {};
	createOrUpdateYProbChart(yProbChart, SIZE, PROB, PROB_MODEL, AUTOSCALE_Y_PROB_CHART);

	// Update charts and UI when user changes the number of items
	sizeInput.addEventListener("input", function () {
		SIZE = parseInt(this.value, 10);
		PROB = parseFloat(probInput.value) / 100;
		updateChart(chart, SIZE, PROB, PROB_MODEL);
		sizeValue.textContent = this.value;
		createOrUpdateYProbChart(yProbChart, SIZE, PROB, PROB_MODEL, AUTOSCALE_Y_PROB_CHART);
	});
	// Update charts and UI when user changes the probability
	probInput.addEventListener("input", function () {
		SIZE = parseInt(sizeInput.value, 10);
		PROB = parseFloat(this.value) / 100;
		updateChart(chart, SIZE, PROB, PROB_MODEL);
		probValue.textContent = this.value + "%";
		createOrUpdateYProbChart(yProbChart, SIZE, PROB, PROB_MODEL, AUTOSCALE_Y_PROB_CHART);
	});
	// Update charts and UI when user changes the probability model
	modelSelect.addEventListener("change", function () {
		PROB_MODEL = this.value;
		updateRangeUI(PROB_MODEL);
		SIZE = parseInt(sizeInput.value, 10);
		PROB = parseFloat(probInput.value) / 100;
		updateChart(chart, SIZE, PROB, PROB_MODEL);
		createOrUpdateYProbChart(yProbChart, SIZE, PROB, PROB_MODEL, AUTOSCALE_Y_PROB_CHART);
	});

	// Set up initial UI state
	updateRangeUI(PROB_MODEL);
	updateLegend(win, draw);
	// Initialize theme and info modal (see ui.js)
	initializeUI();
});
