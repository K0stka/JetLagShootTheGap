# JetLagShootTheGap

JetLagShootTheGap is a web tool for analyzing the probabilities of winning for the **Snaker** in the game _Shoot the Gap_ from **JetLag: The Game**, Season 14, Episode 3.

## Live Example

A live example is hosted at: [https://shootthegap.krychlic.com](https://shootthegap.krychlic.com)

The app lets you explore different probability models and visualize outcomes for the Snaker and Blockers, based on the rules of the game:

-   Three players: one Snaker and two Blockers. Each collects a number of items.
-   The winner is the player who collects the **middle** number of items.
-   Blockers cannot strategize together.
-   Ties are handled as described in the episode or, if ambiguous, as a tie or loss for the Snaker.

The tool provides interactive controls for maximum items, probability of collecting, and model selection, and displays the probability distributions for each possible move.

## Features

-   **Interactive Probability Charts:** Visualize the probability of each result for every possible move.
-   **Multiple Probability Models:** Choose from Binomial, Exponential decay, Poisson, or Uniform models.
-   **Modern UI:** Responsive, dark-mode friendly interface using Tailwind CSS.
-   **Game Rule Reference:** In-app modal explains the rules and edge cases.

---

## Development

### Prerequisites

-   [Node.js](https://nodejs.org/) (v16 or newer recommended)
-   [pnpm](https://pnpm.io/) (install globally with `npm install -g pnpm`)

### Install Dependencies

```sh
pnpm install
```

### Start Development

The `pnpm run dev` command will bundle Tailwind CSS on the fly, but does **not** start a development server.

To view your app locally while developing, we recommend:

#### Using Live Server (Recommended)

1. Install the **Live Server** extension in VS Code.
2. Right-click on `src/index.html` and select **"Open with Live Server"**.

#### Using a Simple Static Server (Alternative)

You can also use a tool like [`serve`](https://www.npmjs.com/package/serve):

```sh
pnpm add -g serve
serve src
```

This will serve the `src/` directory at a local address (e.g., http://localhost:3000).

### Build for Production

```sh
pnpm run build
```

The production-ready files will be output to the `dist/` directory (or as configured).

---

## Project Structure

```
/dist          # Production build output
/src           # Main application source
  /js          # JavaScript modules (chart, probability, UI, etc.)
  index.html   # Main HTML entry point
  index.css    # Main CSS
  tailwind.css # Tailwind CSS entry
build.mjs      # Build script
```

---

## Contributing

We welcome contributions! To get started:

1. **Fork the repository** and clone your fork.
2. **Create a new branch** for your feature or bugfix:
    ```sh
    git checkout -b feature/your-feature-name
    ```
3. **Make your changes** and ensure code quality and formatting.
4. **Test your changes** locally.
5. **Commit and push** your branch:
    ```sh
    git add .
    git commit -m "Describe your change"
    git push origin feature/your-feature-name
    ```
6. **Open a Pull Request** on GitHub and describe your changes.

### Coding Guidelines

-   Use clear, descriptive commit messages.
-   Follow the existing code style and structure.
-   Write modular, maintainable code.
-   Add comments and documentation where helpful.

---

## License

This project is licensed under the MIT License.

---

## Contact

For questions or suggestions, please open an issue or contact the maintainer.
