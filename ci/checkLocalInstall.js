const fs = require('fs');
const path = require('path');

const getSubDirs = (pathToDir) => {
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

const checkDependencie = (json) => {
  const dependencies = json.dependencies;

  const devDependencies = json.devDependencies;

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
    console.log(`\x1b[31m❌ ${json.name} has local dependencies\x1b[0m`);
    return false;
  } else {
    console.log(`\x1b[32m✅ ${json.name} has no local dependencies\x1b[0m`);
    return true;
  }
}

const checkLocalInstall = (template) => {

  let hasErrors = false;

  if (template) {
    const templates = getSubDirs('./templates');

    for (let template of templates) {
      let packageJson = JSON.parse(
        fs
          .readFileSync(path.join('./templates', template, 'package.json'))
          .toString()
      );

      if (!checkDependencie(packageJson)) {
        hasErrors = true;
      }
    }
  } else {
    let packageJson = JSON.parse(
      fs
        .readFileSync('./package.json')
        .toString()
    );

    if (!checkDependencie(packageJson)) {
      hasErrors = true;
    }
  }

  return hasErrors;
}


export { checkLocalInstall };