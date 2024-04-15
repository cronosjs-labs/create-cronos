import fs from 'fs';
import path from 'path';
import { execaCommandSync } from 'execa'
import { expect, test } from 'vitest'

const checkExpress = () => {

    if (!fs.existsSync('./ignore')) {
        fs.mkdirSync('./ignore');
    }

    const hash = crypto.createHash('sha256');

    const testPathFolder = path.resolve('./ignore', hash);

    fs.mkdirSync(testPathFolder);

    process.chdir(testPathFolder);

    const { stdout } = execaCommandSync('create-cronos -p express -r .')

    expect(stdout).toContain("🚀 Let's go! 🚀");
}

export default checkExpress