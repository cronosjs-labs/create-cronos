import fs from 'fs';
import path from 'path';

function getSubDirs(pathToDir) {
  let directories = [];

  let subDirectories = fs.readdirSync(pathToDir);

  for (let subDir of subDirectories) {
    let absolute = path.join(pathToDir, subDir);
    if (fs.statSync(absolute).isDirectory()) {
      directories.push(subDir);
    }
  }

  return directories;
}

const templates = getSubDirs('./templates');

let hasError = false;

for (let template of templates) {
  let packageJson = JSON.parse(
    fs
      .readFileSync(path.join('./templates', template, 'package.json'))
      .toString()
  );

  const dependencies = packageJson.dependencies;

  const devDependencies = packageJson.devDependencies;

  let dependenciesString = '';

  for (let dependency in dependencies) {
    dependenciesString += `${dependency}@${dependencies[dependency]} `;
  }

  let devDependenciesString = '';

  for (let dependency in devDependencies) {
    devDependenciesString += `${dependency}@${devDependencies[dependency]} `;
  }

  const regex = /file:/g;

  const search1 = dependenciesString.match(regex);

  const search2 = devDependenciesString.match(regex);

  if (search1 !== null || search2 !== null) {
    console.log(`\x1b[31m❌ ${template} has local dependencies\x1b[0m`);
    hasError = true;
  } else {
    console.log(`\x1b[32m✅ ${template} has no local dependencies\x1b[0m`);
  }
}

if (hasError) {
  process.exit(1);
} else {
  process.exit(0);
}
