const fs = require("fs");
const path = require("path");

const OUTPUT_FILE = "codebase.md";
const TARGET_EXTENSIONS = [".js", ".ts", ".tsx", ".json", ".prisma"];
const IGNORE_DIRS = ["node_modules", ".git", ".vscode", "migrations"];
const IGNORE_FILES = [".env", "package-lock.json"];
const SENSITIVE_KEYWORDS = ["secret", "key", "token"];

function shouldIgnore(filePath) {
  const lowerPath = filePath.toLowerCase();
  return (
    IGNORE_FILES.includes(path.basename(filePath)) ||
    SENSITIVE_KEYWORDS.some((k) => lowerPath.includes(k))
  );
}

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach((f) => {
    const fullPath = path.join(dir, f);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      if (!IGNORE_DIRS.includes(f)) walkDir(fullPath, callback);
    } else {
      callback(fullPath);
    }
  });
}

function generateMarkdown() {
  let md = `# 📦 Codebase Snapshot\n\n_This markdown file includes non-sensitive project source code._\n\n`;

  walkDir(".", (filePath) => {
    const ext = path.extname(filePath);
    if (
      TARGET_EXTENSIONS.includes(ext) &&
      !shouldIgnore(filePath)
    ) {
      const code = fs.readFileSync(filePath, "utf-8");
      md += `## \`${filePath}\`\n\n`;
      md += "```" + ext.slice(1) + "\n";
      md += code.trim() + "\n";
      md += "```\n\n";
    }
  });

  fs.writeFileSync(OUTPUT_FILE, md);
  console.log(`✅ Markdown file generated: ${OUTPUT_FILE}`);
}

generateMarkdown();
