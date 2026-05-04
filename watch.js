const sass = require("sass");
const fs = require("fs");

const input = "scss/style.scss";
const output = "css/style.css";

function compile() {
  try {
    const result = sass.compile(input, { style: "expanded" });
    fs.writeFileSync(output, result.css);
    console.log(
      `[${new Date().toLocaleTimeString()}] Compiled ${input} → ${output}`,
    );
  } catch (e) {
    console.error(`[Error] ${e.message}`);
  }
}

compile();
fs.watch("scss", { recursive: true }, () => compile());
