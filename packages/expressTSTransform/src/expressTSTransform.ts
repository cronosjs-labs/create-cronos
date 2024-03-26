import fse from 'fs-extra';

import searchJavaScript from "./functions/searchJavaScript";

import createTsConfig from "./functions/createTSConfig";

import updatePackageJSON from "./functions/updatePackageJSON";

import changeFileExtension from "./functions/changeFIleExtension";
import removeJSFromImport from "./functions/removeJSFromImport";
import addReqResTypes from "./functions/addReqResTypes";

const expressTSTransform = (pathToTransform: string) => {

  const processRoute = process.cwd();

  pathToTransform = fse.realpathSync(pathToTransform);

  if (!pathToTransform) {
    console.log("🚨 Path to transform is required");
    return;
  }

  if (typeof pathToTransform !== "string") {
    console.log("🚨 Path to transform must be a string");
    return;
  }

  if (!fse.existsSync(pathToTransform)) {
    console.log("🚨 Path to transform does not exist");
    return;
  }

  const files = searchJavaScript(pathToTransform);

  //! Create tsconfig.json
  createTsConfig(pathToTransform);

  //! Update package.json
  updatePackageJSON(pathToTransform);

  files.forEach((filePath: string) => {

    //! Remove .js from import statements
    removeJSFromImport(filePath);

    //! Add Request and Response types
    addReqResTypes(filePath);

    //! Change file extension
    changeFileExtension(filePath);

  });

  process.chdir(processRoute);

};

export { expressTSTransform };