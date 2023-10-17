#!/usr/bin/env node

import git from "simple-git";
import readline from "readline";
import select from "@inquirer/select";

console.clear();

console.log("\x1b[31m\x1b[1m----------------");

console.log("| \x1b[0mCronos.js!\x1b[31m\x1b[1m🔥 |");
console.log("----------------\x1b[0m");

const tech = await select({
  message: "Select a technology:",
  choices: [
    {
      name: "React",
      value: "react",
    },
    {
      name: "Express",
      value: "express",
    },
  ],
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const name = await prompt("📦 Project name: ");

const route = name === "." ? "." : `./${name}`;

try {
  await git().clone(`https://github.com/cronos-js/cronos.${tech}`, route);
  console.log("🚀 Project created successfully!\n");
  console.log("To get started:");
  console.log("👉 cd", name);
  console.log("👉 npm install");
  console.log("👉 npm run dev \n");
  process.exit(0);
} catch (error) {
  console.log("😨 An error occurred while creating the project.\n");
}
