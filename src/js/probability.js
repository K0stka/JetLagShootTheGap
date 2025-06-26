// Probability models and utility functions

export function binom(n, k) {
	if (k < 0 || k > n) return 0;
	if (k === 0 || k === n) return 1;
	k = Math.min(k, n - k); // Use symmetry
	let res = 1;
	for (let i = 1; i <= k; i++) {
		res = (res * (n - i + 1)) / i;
	}
	return res;
}

export function evaluate(x, y, z) {
	const min = Math.min(y, z);
	const max = Math.max(y, z);
	if (x > min && x < max) return 1; // win
	if (x < min || x > max) return -1; // loss
	return 0; // draw
}

export function poisson(lambda, k) {
	if (k < 0) return 0;
	let fact = 1;
	for (let i = 2; i <= k; i++) fact *= i;
	return (Math.pow(lambda, k) * Math.exp(-lambda)) / fact;
}

export function uniform(n, k) {
	if (k < 0 || k > n) return 0;
	return 1 / (n + 1);
}

export function probability(n, k, PROB, model = "binomial") {
	switch (model) {
		case "binomial":
			return binom(n, k) * Math.pow(PROB, k) * Math.pow(1 - PROB, n - k);
		case "exponential":
			return Math.pow(PROB, k); // Exponential decay (not normalized)
		case "poisson":
			return poisson(n * PROB, k);
		case "uniform":
			return uniform(n, k);
		default:
			return 0;
	}
}

export function calculateResults(SIZE, PROB, model = "binomial") {
	const win = new Float64Array(SIZE + 1);
	const draw = new Float64Array(SIZE + 1);
	const lose = new Float64Array(SIZE + 1);

	const probCache = new Float64Array(SIZE + 1);
	for (let i = 0; i <= SIZE; i++) {
		probCache[i] = probability(SIZE, i, PROB, model);
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

export function yPlayerProbabilities(SIZE, PROB, model = "binomial") {
	const probs = new Float64Array(SIZE + 1);
	let total = 0;
	for (let n = 0; n <= SIZE; n++) {
		probs[n] = probability(SIZE, n, PROB, model);
		total += probs[n];
	}
	for (let n = 0; n <= SIZE; n++) {
		probs[n] = (probs[n] / total) * 100;
	}
	return probs;
}
