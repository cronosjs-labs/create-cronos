import fs from 'fs';
import path from 'path';

/**
 * Copies a file or a directory from a source to a destination.
 * If the source is a directory, it uses the copyDir function to copy it.
 *
 * @param {string} src - The source file or directory to copy from.
 * @param {string} dest - The destination file or directory to copy to.
 */

export const copy = (src: string, dest: string) => {
  const stat = fs.statSync(src);
  if (stat.isDirectory()) {
    copyDir(src, dest);
  } else {
    try {
      if (src.includes('_gitignore')) {
        const newDest = dest.replace('_', '.');
        fs.copyFileSync(src, newDest);
      } else {
        fs.copyFileSync(src, dest);
      }
    } catch (err) {
      console.log(err);
    }
  }
};

/**
 * Copies a directory from a source to a destination.
 *
 * @param {string} srcDir - The source directory to copy from.
 * @param {string} destDir - The destination directory to copy to.
 */

export const copyDir = (srcDir: string, destDir: string) => {
  try {
    fs.mkdirSync(destDir, { recursive: true });
  } catch (err) {
    console.log(err);
  }

  try {
    for (const file of fs.readdirSync(srcDir)) {
      const srcFile = path.resolve(srcDir, file);
      const destFile = path.resolve(destDir, file);
      copy(srcFile, destFile);
    }
  } catch (err) {
    console.log(err);
  }
};
