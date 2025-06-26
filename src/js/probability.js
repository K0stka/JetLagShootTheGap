// Probability models and utility functions for JetLag: Shoot the Gap
// Implements the game logic as described in the rules:
// - Three players: one Snaker, two Blockers
// - Each collects a number of items (0..SIZE)
// - Winner is the player with the middle value
// - Blockers are not allowed to strategize; their results are independent
// - Special tie/loss rules are handled in evaluate()

// Binomial coefficient: number of ways to choose k items from n
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

// Evaluate the outcome for the Snaker (x) given Blockers (y, z)
// Returns:
//   1 for win (Snaker has the middle value)
//   0 for draw (ambiguous tie, or Snaker ties with a Blocker and the other Blocker is different)
//  -1 for loss (Snaker does not have the middle value)
export function evaluate(x, y, z) {
	const min = Math.min(y, z);
	const max = Math.max(y, z);
	if (x > min && x < max) return 1; // win: Snaker is in the middle
	if (x < min || x > max) return -1; // loss: Snaker is not in the middle
	return 0; // draw: tie or ambiguous case
}

// Poisson probability mass function
export function poisson(lambda, k) {
	if (k < 0) return 0;
	let fact = 1;
	for (let i = 2; i <= k; i++) fact *= i;
	return (Math.pow(lambda, k) * Math.exp(-lambda)) / fact;
}

// Uniform probability: all outcomes equally likely
export function uniform(n, k) {
	if (k < 0 || k > n) return 0;
	return 1 / (n + 1);
}

// Returns the probability of collecting k items out of n, using the selected model
export function probability(n, k, PROB, model = "binomial") {
	switch (model) {
		case "binomial":
			// Each item is collected independently with probability PROB
			return binom(n, k) * Math.pow(PROB, k) * Math.pow(1 - PROB, n - k);
		case "exponential":
			// Exponential decay: probability decreases exponentially with k
			return Math.pow(PROB, k); // Not normalized
		case "poisson":
			// Poisson: expected value lambda = n * PROB
			return poisson(n * PROB, k);
		case "uniform":
			// All outcomes equally likely
			return uniform(n, k);
		default:
			return 0;
	}
}

// Calculates the probability of win/draw/loss for each possible Snaker move (0..SIZE)
// For each possible number of items the Snaker could collect (x):
//   - Computes the probability that x is the middle value, given all possible Blocker outcomes
//   - Uses the evaluate() function to determine win/draw/loss
//   - Returns arrays of win, draw, and lose percentages for each x
export function calculateResults(SIZE, PROB, model = "binomial") {
	const win = new Float64Array(SIZE + 1);
	const draw = new Float64Array(SIZE + 1);
	const lose = new Float64Array(SIZE + 1);

	// Precompute Blocker probabilities for efficiency
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
				const prob = probY * probZ; // Blockers are independent
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

// Returns the probability distribution for a single Blocker (used for the right-hand chart)
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
