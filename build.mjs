import { build } from "esbuild";
import fs from "fs";
import htmlMinifier from "html-minifier-terser";
import path from "path";

// Bundle and minify JS with esbuild
const jsEntry = path.join("src/js", "index.js");
const jsOut = path.join("dist", "bundle.js");
await build({
	entryPoints: [jsEntry],
	bundle: true,
	minify: true,
	outfile: jsOut,
	format: "esm",
	sourcemap: false,
});
console.log("Bundled and minified JS written to", jsOut);

// Bundle and minify CSS
const cssIn = path.join("src", "index.css");
const cssOut = path.join("dist", "index.css");
if (fs.existsSync(cssIn)) {
	let css = fs.readFileSync(cssIn, "utf8");
	// Optionally, you could minify CSS here if desired
	fs.writeFileSync(cssOut, css, "utf8");
	console.log("Copied CSS to", cssOut);
}

// Minify HTML
const htmlPath = path.join("src", "index.html");
const htmlOutPath = path.join("dist", "index.html");
let htmlCode = fs.readFileSync(htmlPath, "utf8");

// Update imports
htmlCode = htmlCode.replace("../dist/bundle.css", "bundle.css");
htmlCode = htmlCode.replace("js/index.js", "bundle.js");

const minifiedHtml = await htmlMinifier.minify(htmlCode, {
	collapseWhitespace: true,
	removeComments: true,
	minifyJS: true,
	minifyCSS: true,
});

fs.mkdirSync(path.dirname(htmlOutPath), { recursive: true });
fs.writeFileSync(htmlOutPath, minifiedHtml, "utf8");
console.log("Minified HTML written to", htmlOutPath);
