#!/usr/bin/env node

import git from "simple-git";

console.clear();

console.log("\x1b[31m\x1b[1m----------------");

console.log("| \x1b[0mCronos.js!\x1b[31m\x1b[1m🔥 |");
console.log("----------------\x1b[0m");

try {
  await git().clone("https://github.com/cronos-js/cronos.express", ".");
  console.log("🚀 Project created successfully!\n");
} catch (error) {
  console.log("😨 An error occurred while creating the project.\n");
}
