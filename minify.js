const { execSync } = require("child_process");
const fs = require("fs");
const path = require("path");
const { minify } = require("terser");
const htmlMinifier = require("html-minifier-terser");

// Minify JS
const jsPath = path.join(__dirname, "src", "index.js");
const jsOutPath = path.join(__dirname, "dist", "index.js");
const jsCode = fs.readFileSync(jsPath, "utf8");
(async () => {
	const result = await minify(jsCode);
	fs.mkdirSync(path.dirname(jsOutPath), { recursive: true });
	fs.writeFileSync(jsOutPath, result.code, "utf8");
	console.log("Minified JS written to", jsOutPath);

	// Minify HTML
	const htmlPath = path.join(__dirname, "src", "index.html");
	const htmlOutPath = path.join(__dirname, "dist", "index.html");
	const htmlCode = fs.readFileSync(htmlPath, "utf8");
	const minifiedHtml = await htmlMinifier.minify(htmlCode, {
		collapseWhitespace: true,
		removeComments: true,
		minifyJS: true,
		minifyCSS: true,
	});
	fs.mkdirSync(path.dirname(htmlOutPath), { recursive: true });
	fs.writeFileSync(htmlOutPath, minifiedHtml, "utf8");
	console.log("Minified HTML written to", htmlOutPath);
})();
