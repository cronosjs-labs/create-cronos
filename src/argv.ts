import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .options({
    t: { type: 'string', alias: 't' },
    c: { type: 'string', alias: 'c' }
  })
  .parseSync();

export default argv;
