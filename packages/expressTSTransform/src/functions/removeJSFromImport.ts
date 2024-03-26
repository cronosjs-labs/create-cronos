import fs from "fs";

//* Example: import { something } from './something.js' => import { something } from './something'

const removeJSFromImport = (filePath: string) => {
    const data = fs.readFileSync(filePath, "utf8");
    let newData = data.replace(
        /import\s+{\s*(.*?)\s*}\s+from\s+['"]([^'"]+)\.js['"]/g,
        "import {$1} from '$2'"
    );
    newData = newData.replace(
        /import\s*(\w*?)\s*from\s+['"]([^'"]+)\.js['"]/g,
        "import $1 from '$2'"
    );
    fs.writeFileSync(filePath, newData);
};

export default removeJSFromImport;