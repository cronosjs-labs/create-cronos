const fs = require('fs');
const path = require('path');

import { Data } from '../types/Data';

const createTsConfig = (folderPath: string) => {
  const tsConfig = {
    compilerOptions: {
      target: 'es2022',
      lib: ['es2022'],
      strict: true,
      module: 'CommonJS',
      rootDir: 'src',
      outDir: 'dist',
      moduleResolution: 'node',
      skipLibCheck: true,
      sourceMap: true,
      allowSyntheticDefaultImports: true,
      forceConsistentCasingInFileNames: true,
      esModuleInterop: true,
      importHelpers: true,
      removeComments: true,
      noFallthroughCasesInSwitch: true,
      noImplicitOverride: true,
      noUnusedLocals: true,
      noUncheckedIndexedAccess: true,
      allowUnreachableCode: false,
      emitDecoratorMetadata: true,
      experimentalDecorators: true
    },
    include: ['src'],
    exclude: ['node_modules']
  };

  const targetDir = path.join(process.cwd());

  fs.writeFileSync(
    targetDir + '/tsconfig.json',
    JSON.stringify(tsConfig, null, 2)
  );
};

const changeFileExtension = (filePath: string, newExtension: string) => {
  const newFile = filePath.replace(/.js$/, `.${newExtension}`);
  fs.renameSync(filePath, newFile);
};

const expressTsTransform = (data: Data) => {
  console.clear();

  const folderPath = data.name;

  console.log(data.name);

  if (!folderPath) {
    console.log('Please provide a folder path');
    process.exit(1);
  }

  let targetDir = process.cwd();

  targetDir = path.join(targetDir, 'src');

  let files = fs.readdirSync(targetDir);

  let folders = files.filter((file: string) => {
    return fs.statSync(path.join(targetDir, file)).isDirectory();
  });

  //! CHANGE EXTENSION OF FILES IN SRC FOLDER FROM .js TO .ts

  console.log('⚙️  Changing file extensions to .ts');

  folders.forEach((folder: string) => {
    const files = fs
      .readdirSync(path.join(targetDir, folder))
      .filter((file: string) => file.endsWith('.js'));

    files.forEach((file: string) => {
      changeFileExtension(path.join(targetDir, folder, file), 'ts');
    });
  });

  files.forEach((file) => {
    if (file.endsWith('.js')) {
      changeFileExtension(path.join(targetDir, file), 'ts');
    }
  });

  //* Update variable files to include .ts files
  files = fs.readdirSync(targetDir);
  folders = files.filter((file) => {
    return fs.statSync(path.join(targetDir, file)).isDirectory();
  });

  //! CREATE TS CONFIG FILE

  console.log('⚙️  Creating tsconfig.json file');

  createTsConfig(folderPath);

  //! UPLOAD IMPORTS IN FILES TO REMOVE .js
  //* Example: import { something } from './something.js' => import { something } from './something'

  console.log('⚙️  Removing .js from imports');

  console.log('🔎     Explore folders');

  folders.forEach((folder) => {
    const files = fs
      .readdirSync(path.join(targetDir, folder))
      .filter((file) => file.endsWith('.ts'));
    console.log('🛸     +++++++++++++++', files);

    files.forEach((file) => {
      const filePath = path.join(targetDir, folder, file);
      const data = fs.readFileSync(filePath, 'utf8');

      let newData = data.replace(
        /import\s+{\s*(.*?)\s*}\s+from\s+['"]([^'"]+)\.js['"]/g,
        "import {$1} from '$2'"
      );
      newData = newData.replace(
        /import\s*(\w*?)\s*from\s+['"]([^'"]+)\.js['"]/g,
        "import $1 from '$2'"
      );

      fs.writeFileSync(filePath, newData);
      console.log(' ✅ Done', file);
    });
  });

  console.log('🔎     Explore files');

  files.forEach((file) => {
    console.log('🛸     +++++++++++++++', file);

    if (file.endsWith('.ts')) {
      const filePath = path.join(targetDir, file);
      const data = fs.readFileSync(filePath, 'utf8');
      let newData = data.replace(
        /import\s+{\s*(.*?)\s*}\s+from\s+['"]([^'"]+)\.js['"]/g,
        "import {$1} from '$2'"
      );
      newData = newData.replace(
        /import\s*(\w*?)\s*from\s+['"]([^'"]+)\.js['"]/g,
        "import $1 from '$2'"
      );
      fs.writeFileSync(filePath, newData);
      console.log(' ✅ Done', file);
    }
  });

  //! UPDATE PACKAGE.JSON
  console.log('⚙️  Updating package.json');

  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );

  packageJson.scripts.dev = 'nodemon --exec ts-node src/index.ts';
  packageJson.scripts.build = 'tsc';
  packageJson.type = 'commonjs';

  fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  console.log('✅ Done');

  //! ADD TYPES TO CONTROLERS AND ROUTES
  console.log('⚙️  Adding types to controllers and routes');

  console.log('🔎     Explore folders');

  folders.forEach((folder) => {
    const files = fs
      .readdirSync(path.join(targetDir, folder))
      .filter((file) => file.endsWith('.ts'));
    console.log('🛸     +++++++++++++++', files);

    files.forEach((file) => {
      const filePath = path.join(targetDir, folder, file);
      const data = fs.readFileSync(filePath, 'utf8');
      const regex = /async \(req, res\)/g;
      const newData = data.replace(
        regex,
        'async (req: Request, res: Response)'
      );

      const importStatement = `import { Request, Response } from 'express';\n`;
      if (regex.test(data)) {
        fs.writeFileSync(filePath, importStatement + newData);
      } else {
        fs.writeFileSync(filePath, newData);
      }

      console.log(' ✅ Done', file);
    });
  });

  console.log('🔎     Explore files');

  files.forEach((file) => {
    console.log('🛸     +++++++++++++++', file);

    if (file.endsWith('.ts')) {
      const filePath = path.join(targetDir, file);
      const data = fs.readFileSync(filePath, 'utf8');
      const regex = /async \(req, res\)/g;
      const newData = data.replace(
        regex,
        'async (req: Request, res: Response)'
      );

      const importStatement = `import { Request, Response } from 'express';\n`;
      if (regex.test(data)) {
        fs.writeFileSync(filePath, importStatement + newData);
      } else {
        fs.writeFileSync(filePath, newData);
      }
      console.log(' ✅ Done', file);
    }
  });

  console.log('✅ Done');

  //! ADD TYPES
  console.log('⚙️  Adding types and dependencies');

  const packageJson2 = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );

  packageJson2.dependencies['@types/express'] = 'latest';

  fs.writeFileSync(
    path.join(process.cwd(), 'package.json'),
    JSON.stringify(packageJson2, null, 2)
  );

  console.log('✅ Done');
};

export { expressTsTransform };
