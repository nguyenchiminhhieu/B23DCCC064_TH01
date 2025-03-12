const fs = require("fs");
const path = require("path");

function listFiles(dir, depth = 0, maxDepth = 3) {
  if (depth > maxDepth) return "";
  let output = "";

  const files = fs.readdirSync(dir);
  files.forEach((file) => {
    const fullPath = path.join(dir, file);
    const isDirectory = fs.lstatSync(fullPath).isDirectory();

    output += "  ".repeat(depth) + (isDirectory ? "📁 " : "📄 ") + file + "\n";
    if (isDirectory) {
      output += listFiles(fullPath, depth + 1, maxDepth);
    }
  });

  return output;
}

const structure = "📂 Project Structure:\n" + listFiles(__dirname);
fs.writeFileSync("structure.txt", structure, "utf-8");

console.log("✅ Cấu trúc thư mục đã được lưu vào structure.txt!");
