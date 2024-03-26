import fs from "fs";
import path from "path";

const updatePackageJSON = (folderPath: string) => {
    const packageJson = JSON.parse(
        fs.readFileSync(path.join(folderPath, "package.json"), "utf8")
    );

    //! Type
    packageJson.type = "commonjs";

    //! Scripts
    packageJson.scripts.dev = "nodemon --exec ts-node src/index.ts";
    packageJson.scripts.build = "tsc";
    packageJson.scripts.start = "node dist/index.js";

    //! Typescript types
    packageJson.dependencies["@types/express"] = "latest";
    packageJson.dependencies["@types/supertest"] = "latest";

    fs.writeFileSync(
        path.join(folderPath, "package.json"),
        JSON.stringify(packageJson, null, 2)
    );
};

export default updatePackageJSON;
