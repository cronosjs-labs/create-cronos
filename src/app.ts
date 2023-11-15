#!/usr/bin/env node

import git from "simple-git";
import readline from "readline";
import checkbox, { Separator } from "@inquirer/checkbox";
import select from "@inquirer/select";
import { spawn } from "child_process";

import reactChoices from "./packages/react-choices.js";
import expressChoices from "./packages/express-choices.js";

const os = process.platform;

const npmCommand = os === "win32" ? "npm.cmd" : "npm";

//! PRINT LETTERS
console.clear();

console.log("\x1b[33m────────────────────────────\x1b[37m");

console.log("           \x1b[33m\x1b[1m\x1b[37mCronos 🔥  \x1b[0m\x1b[31m");

//log github
console.log(
  "\x1b[33m\x1b[1m\x1b[31mhttps://github.com/cronos-js\x1b[0m\x1b[31m"
);

console.log("\x1b[33m────────────────────────────\x1b[37m");

//! TECH SELECT
const main = async () => {
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

  //! PROJECT NAME
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  const name = await prompt("  💡 Project name: ");

  const route = name === "." ? "." : `./${name}`;

  //! EXTRA PACKAGES
  const extraPackages: string[] | null =
    tech == "react"
      ? await checkbox({
          message: "📦 Select extra packages:",
          choices: reactChoices,
        })
      : tech == "express"
      ? await checkbox({
          message: "📦 Select extra packages:",
          choices: expressChoices,
        })
      : null;

  //! CLONE REPO
  try {
    await git().clone(`https://github.com/cronos-js/cronos.${tech}`, route);
  } catch (error) {
    console.log("  😨 An error occurred while creating the project.\n");
  }

  //! INSTALL DEPENDENCIES
  console.clear();
  try {
    process.chdir(route);

    console.log("  🧩 Installing dependencies...");

    await new Promise<void>((resolve, reject) => {
      const install = spawn(npmCommand, ["install"], {
        stdio: "inherit",
      });

      install.on("close", (code) => {
        if (code !== 0) {
          reject(new Error("Error installing dependencies"));
        } else {
          resolve();
        }
      });
    });

    if (extraPackages?.length !== 0) {
      console.log("  🧩 Installing extra packages...");

      await new Promise<void>((resolve, reject) => {
        const installExtra = spawn(npmCommand, ["install", ...extraPackages!], {
          stdio: "inherit",
        });

        installExtra.on("close", (code) => {
          if (code !== 0) {
            reject(new Error("Error installing extra packages"));
          } else {
            console.clear();

            console.log("  🚀 Project created successfully!\n");

            console.log("  📂 To get started, run the following commands:\n");

            console.log(`    \x1b[1mcd ${name}`);

            console.log("    run dev\n\x1b[0m");

            console.log(
              "  📖 For more information, visit https://github.com/cronos-js\n"
            );

            resolve();
          }
        });
      });
    }
  } catch (error) {
    console.error("  😨 An error occurred while installing packages.\n", error);
    process.exit(1);
  }
};

main();
