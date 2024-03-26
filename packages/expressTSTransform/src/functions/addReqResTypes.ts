import fs from "fs";

const addReqResTypes = (filePath: string) => {
    const data = fs.readFileSync(filePath, "utf8");

    const regex = /(req, res)/g;
    let newData = data.replace(regex, "req: Request, res: Response");

    const importStatement = `import { Request, Response } from 'express'\n`;

    if (regex.test(data)) {
        fs.writeFileSync(filePath, importStatement + newData);
    } else {
        fs.writeFileSync(filePath, newData);
    }
};


export default addReqResTypes;