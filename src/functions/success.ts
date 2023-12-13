const success = (name: string | unknown) => {
  console.clear();

  console.log('  🚀 Project created successfully!\n');

  if (name !== '.') {
    console.log('  📂 To get started, run the following commands:\n');

    console.log(`    \x1b[1mcd ${name}`);

    console.log('    npm run dev\n\x1b[0m');
  } else {
    console.log('  📂 To get started, run the following command:\n');

    console.log('    npm run dev\n\x1b[0m');
  }

  console.log(
    '  📖 For more information, visit https://github.com/cronos-js\n'
  );
};

export { success };
