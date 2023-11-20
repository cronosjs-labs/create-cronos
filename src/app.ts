#!/usr/bin/env node

//! esm
import git from "simple-git";
import readline from "readline";
import checkbox, { Separator } from "@inquirer/checkbox";
import select from "@inquirer/select";
import { spawn } from "child_process";
import fs from "fs";

//! commonjs
const path = require("path");

//! PACKAGES
import reactChoices from "./packages/react-choices.js";
import expressChoices from "./packages/express-choices.js";

//! VARIABLES
const currentDir = __dirname;
const os = process.platform;
const npmCommand = os === "win32" ? "npm.cmd" : "npm";

//! ARGS
const args = process.argv.slice(2);
const canary = args.includes("--canary");

//! PRINT LETTERS
console.clear();

console.log("\x1b[33m────────────────────────────\x1b[37m");

canary
  ? console.log(
      "      \x1b[33m\x1b[1m\x1b[37mCronos Canary 🟡  \x1b[0m\x1b[31m"
    )
  : console.log("           \x1b[33m\x1b[1m\x1b[37mCronos 🔥  \x1b[0m\x1b[31m");

//log github
console.log(
  "\x1b[33m\x1b[1m\x1b[31mhttps://github.com/cronos-js\x1b[0m\x1b[31m"
);

console.log("\x1b[33m────────────────────────────\x1b[37m");

//* ----------------------------------------------------------------------------------------

/**
 * Copies a directory from a source to a destination.
 *
 * @param {string} srcDir - The source directory to copy from.
 * @param {string} destDir - The destination directory to copy to.
 */

const copyDir = (srcDir: string, destDir: string) => {
  fs.mkdirSync(destDir, { recursive: true });
  for (const file of fs.readdirSync(srcDir)) {
    const srcFile = path.resolve(srcDir, file);
    const destFile = path.resolve(destDir, file);
    copy(srcFile, destFile);
  }
};

/**
 * Copies a file or a directory from a source to a destination.
 * If the source is a directory, it uses the copyDir function to copy it.
 *
 * @param {string} src - The source file or directory to copy from.
 * @param {string} dest - The destination file or directory to copy to.
 */

const copy = (src: string, dest: string) => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    fs.copyFileSync(src, dest);
  }
};

/**
 * This function logs a success message to the console after a project has been created successfully.
 * It provides the user with instructions on how to start using the project.
 *
 * @param name - The name of the project. It can be a string or any other type.
 */

const success = (name: string | unknown) => {
  console.clear();

  console.log("  🚀 Project created successfully!\n");

  console.log("  📂 To get started, run the following commands:\n");

  console.log(`    \x1b[1mcd ${name}`);

  console.log("    npm run dev\n\x1b[0m");

  console.log(
    "  📖 For more information, visit https://github.com/cronos-js\n"
  );
};

//! MAIN
const main = async () => {
  const techChoices = [
    {
      name: "React",
      value: "react",
    },
    {
      name: "Express (TypeScript)",
      value: "express-typescript",
    },
  ];

  if (canary) {
    techChoices.push({
      name: "React (TypeScript)",
      value: "react-typescript",
    });

    techChoices.push({
      name: "Express",
      value: "express",
    });

    techChoices.sort((a, b) => {
      if (a.name < b.name) return -1;
      if (b.name > a.name) return 1;
      return 0;
    });
  }

  //! TECH SELECT
  const tech = await select({
    message: "💻 Select a technology:",
    choices: techChoices,
  });

  //! PROJECT NAME
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  const prompt = (query) =>
    new Promise((resolve) => rl.question(query, resolve));

  const name: string | unknown = await prompt("  💡 Project name: ");

  const route = name === "." ? "." : `./${name}`;

  if (name !== ".") {
    fs.mkdirSync(route);
    process.chdir(route);
  }

  //! EXTRA PACKAGES
  const extraPackages: string[] | null =
    tech == "react"
      ? await checkbox({
          message: "📦 Select extra packages:",
          choices: reactChoices,
        })
      : canary && tech == "express"
      ? await checkbox({
          message: "📦 Select extra packages:",
          choices: expressChoices,
        })
      : tech == "express-typescript"
      ? await checkbox({
          message: "📦 Select extra packages:",
          choices: expressChoices,
        })
      : canary && tech == "react-typescript"
      ? await checkbox({
          message: "📦 Select extra packages:",
          choices: reactChoices,
        })
      : null;

  //! CLONE REPO
  try {
    if (canary) {
      const templateDir = path.join(currentDir, `../templates/${tech}`);

      const targetDir = process.cwd();

      const write = (file: string, content?: string) => {
        const targetPath = path.join(targetDir, file);
        if (content) {
          fs.writeFileSync(targetPath, content);
        } else {
          copy(path.join(templateDir, file), targetPath);
        }
      };

      const files = fs.readdirSync(templateDir);

      for (const file of files) {
        write(file);
      }
    } else {
      await git().clone(`https://github.com/cronos-js/cronos.${tech}`, ".");
    }
  } catch (error) {
    console.log(error);
    console.log("  😨 An error occurred while creating the project.\n");
  }

  //! INSTALL DEPENDENCIES
  console.clear();

  try {
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

    // If there are no extra packages, end the function successfully
    if (!extraPackages) return success(name);

    // If there are extra packages, proceed to install them
    if (extraPackages.length > 0) {
      console.log("  🧩 Installing extra packages...");

      // Create a new promise to handle the installation process
      await new Promise<void>((resolve, reject) => {
        // Start the installation process
        const installExtra = spawn(npmCommand, ["install", ...extraPackages!], {
          stdio: "inherit",
        });

        // When the installation process closes, check if there was an error
        installExtra.on("close", (code) => {
          // If the exit code is not 0, an error occurred
          if (code !== 0) {
            reject(new Error("Error installing extra packages"));
          } else {
            // If the exit code is 0, the installation was successful
            success(name);
            resolve();
          }
        });
      });
    } else {
      // If there are no extra packages, end the function successfully
      success(name);
    }
  } catch (error) {
    console.error("  😨 An error occurred while installing packages.\n", error);
    process.exit(1);
  }
};

main();
