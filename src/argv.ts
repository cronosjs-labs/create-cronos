import yargs from 'yargs';

const argv = yargs(process.argv.slice(2))
  .options({
    t: { type: 'string', alias: 'template' },
    c: { type: 'string', alias: 'config' }
  })
  .parseSync();

export default argv;
