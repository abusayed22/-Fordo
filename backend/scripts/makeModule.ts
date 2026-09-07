import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const moduleName: string | undefined = process.argv[2];

if (!moduleName) {
  console.error("❌ pnpm make:module product");
  process.exit(1);
}

// ESM-এ ফাইল ডিরেক্টরি পাওয়ার সঠিক উপায়
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// scripts ফোল্ডার থেকে এক ধাপ পেছনে গিয়ে src/modules/<moduleName> সিলেক্ট করা
const targetDir: string = path.resolve(__dirname, "..","src","app", "module", moduleName);

// ফোল্ডার না থাকলে তৈরি করবে
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// ৬টি প্রয়োজনীয় ফাইল
const files: string[] = [
  "controller.ts",
  "service.ts",
  "route.ts",
  "interface.ts",
  "validation.ts",
  "constants.ts",
];

files.forEach((file: string) => {
  const fileName: string = `${moduleName}.${file}`;
  const filePath: string = path.join(targetDir, fileName);

  if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, `// ${moduleName} ${file.replace(".ts", "")}\n`);
    console.log(`✅ Created: ${fileName}`);
  }

  // console.log("path :",filePath, `// ${moduleName} ${file.replace(".ts", "")}\n`)
});

console.log(`\n🎉 Module "${moduleName}" created at: src/module/${moduleName}\n`);