#!/usr/bin/env node

import git from "simple-git";
import readline from "readline";
import checkbox, { Separator } from "@inquirer/checkbox";
import select from "@inquirer/select";
import { exec } from "child_process";

console.clear();

console.log("\x1b[31m\x1b[1m----------------");

console.log("| \x1b[0mCronos.js!\x1b[31m\x1b[1m🔥 |");
console.log("----------------\x1b[0m");

const tech = await select({
  message: "💻 Select a technology:",
  choices: [
    {
      name: "React",
      value: "react",
    },
    {
      name: "Express (TypeScript)",
      value: "express",
    },
  ],
});

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const prompt = (query) => new Promise((resolve) => rl.question(query, resolve));

const name = await prompt("  💡 Project name: ");

const route = name === "." ? "." : `./${name}`;

const answer =
  tech == "react"
    ? await checkbox({
        message: "📦 Select extra packages:",
        choices: [{ name: "Zustand", value: "zustand" }],
      })
    : tech == "express"
    ? await checkbox({
        message: "📦 Select extra packages:",
        choices: [
          { name: "Mongoose", value: "mongoose" },
          { name: "Cors", value: "cors" },
          { name: "Bcrypt", value: "bcrypt" },
          { name: "Dotenv", value: "dotenv" },
        ],
      })
    : null;

try {
  await git().clone(`https://github.com/cronos-js/cronos.${tech}`, route);
} catch (error) {
  console.log("  😨 An error occurred while creating the project.\n");
}

console.log("  🧩 Installing dependencies...");

await exec(`npm --prefix ${route} install`, (error, stdout, stderr) => {
  if (error) {
    console.log("  😨 An error occurred while installing dependencies.\n");
  }

  exec(
    `npm --prefix ${route} install ${answer.join(" ")}`,
    (error, stdout, stderr) => {
      if (error) {
        console.log("  😨 An error occurred while installing dependencies.\n");
      } else {
        console.log("  🚀 Project created successfully!\n");

        console.clear();

        console.log("\x1b[31m\x1b[1m----------------");

        console.log("| \x1b[0mCronos.js!\x1b[31m\x1b[1m🔥 |");
        console.log("----------------\x1b[0m");

        console.log("\n📌 Get started with the following commands:\n");

        console.log(`    cd ${name}`);

        console.log("    npm run dev\n");
      }
    }
  );
});
