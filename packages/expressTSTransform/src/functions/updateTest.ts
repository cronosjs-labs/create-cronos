import fs from "fs";

const updateTest = (filePath: string) => {
    if (!filePath.includes(".test.ts")) {
        return;
    }
    const data = fs.readFileSync(filePath, "utf8");

    const regex = /let server/g;
    let newData = data.replace(regex, "let server: any");

    if (regex.test(data)) {
        fs.writeFileSync(filePath, newData);
    }
};


export default updateTest;