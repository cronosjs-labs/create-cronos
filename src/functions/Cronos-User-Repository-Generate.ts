import fetch from 'node-fetch';
import fs from 'fs';

const path = require('path');

interface Project {
  name: string;
  description: string;
  route: string;
  typescript: boolean;
  extra: string;
}

/**
 * Generate files from a template.
 *
 * @param {string} file - The route of the original template file.
 * @param {string} name - The name of the original template.
 */
const generateFiles = async (file: string, name: string) => {
  // EXAMPLE: public/index.html -> index.html
  const parse = file.replace(name + '/', '');

  const url = `https://raw.githubusercontent.com/cronos-js/Cronos-User-Repository/main/templates/${name}/${parse}`;
  const response = await fetch(url);
  const data = await response.text();

  const route = path.join(process.cwd(), parse);

  fs.writeFileSync(route, data);

  console.log('✅ Created file: ' + parse);
};

async function cronosUserRepositoryGenerate(answer: string) {
  try {
    const url = `https://raw.githubusercontent.com/cronos-js/Cronos-User-Repository/main/templates/${answer}/cronos-template.json`;

    const response = await fetch(url);

    const data = await response.text();

    const dataJSON = JSON.parse(data);

    const directories = dataJSON.directories;

    const files = dataJSON.files;

    const name = dataJSON.name;

    directories.forEach((directory: string) => {
      const parseDirectory = directory.replace(name + '/', '');

      fs.mkdirSync(`${parseDirectory}`);
      console.log('📂 Created directory: ' + parseDirectory);
    });

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      await generateFiles(file, name);
    }
  } catch (error) {
    console.log(error);
    process.exit(1);
  }

  console.log('\n🎉 Done!');
}

export { cronosUserRepositoryGenerate };
