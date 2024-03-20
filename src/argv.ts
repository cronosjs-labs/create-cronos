import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .options({
    //* Custom templates folder for example:          -t /path/to/templates
    t: { type: 'string', alias: 't' },
    //* Custom config file for example:               -c /path/to/config.ts
    c: { type: 'string', alias: 'c' },
    //* Select the project to generate for example:   -p express
    p: { type: 'string', alias: 'p' }
  })
  .parseSync();

export default argv;
