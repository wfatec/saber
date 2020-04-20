import { join, basename } from 'path';
import { renameSync } from 'fs';
import { sync as emptyDir } from 'empty-dir';
import leftPad from 'left-pad';
import * as chalk from 'saber-dev-utils/chalk';
import * as inquirer from 'saber-dev-utils/inquirer';

function info(type, message) {
  console.log(`${chalk.green.bold(leftPad(type, 12))}  ${message}`);
}

function error(message) {
  console.error(chalk.red(message));
}

function success(message) {
  console.error(chalk.green(message));
}

function init({ demo, install }) {
  const type = demo ? 'demo' : 'app';
  const cwd = join(__dirname, '../boilerplates', type);
  const dest = process.cwd();
  const projectName = basename(dest);

  if (!emptyDir(dest)) {
    error('Existing files here, please run init command in an empty folder!');
    process.exit(1);
  }

  console.log(`Creating a new Dva app in ${dest}.`);
  console.log();

  vfs.src(['**/*', '!node_modules/**/*'], {cwd: cwd, cwdbase: true, dot: true})
    .pipe(template(dest, cwd))
    .pipe(vfs.dest(dest))
    .on('end', function() {
      info('rename', 'gitignore -> .gitignore');
      renameSync(join(dest, 'gitignore'), join(dest, '.gitignore'));
      if (install) {
        info('run', 'npm install');
        require('./install')(printSuccess);
      } else {
        printSuccess();
      }
    })
    .resume();

  function printSuccess() {
    success(`
Success! Created ${projectName} at ${dest}.

Inside that directory, you can run several commands:
  * npm start: Starts the development server.
  * npm run build: Bundles the app into dist for production.
  * npm test: Run test.

We suggest that you begin by typing:
  cd ${dest}
  npm start

Happy hacking!`);
  }
}

// function template(dest, cwd) {
//   return through.obj(function (file, enc, cb) {
//     if (!file.stat.isFile()) {
//       return cb();
//     }

//     info('create', file.path.replace(cwd + '/', ''));
//     this.push(file);
//     cb();
//   });
// }

function copyTpl(opts) {
  const tpl = readFileSync(opts.templatePath, 'utf-8');
  const content = Mustache.render(tpl, opts.context);
  mkdirp.sync(dirname(opts.target));
  console.log(`${chalk.green('Write:')} ${relative(this.cwd, opts.target)}`);
  writeFileSync(opts.target, content, 'utf-8');
}

function copyDirectory(opts) {
  const files = glob.sync('**/*', {
    cwd: opts.path,
    dot: true,
    ignore: ['**/node_modules/**'],
  });
  files.forEach((file) => {
    const absFile = join(opts.path, file);
    if (statSync(absFile).isDirectory()) return;
    if (file.endsWith('.tpl')) {
      this.copyTpl({
        templatePath: absFile,
        target: join(opts.target, file.replace(/\.tpl$/, '')),
        context: opts.context,
      });
    } else {
      console.log(`${chalk.green('Copy: ')} ${file}`);
      const absTarget = join(opts.target, file);
      mkdirp.sync(dirname(absTarget));
      copyFileSync(absFile, absTarget);
    }
  });
}

export default function (...args) {
  console.log('inquirer: ', inquirer);
  // return null
  inquirer.prompt([
    {
      type: 'confirm',
      name: 'insist',
      message: `Do you insist on using dva-cli?`,
      default: false,
    },
  ]).then(({ insist }) => {
    if (insist) {
      init(args)
    } else {
      console.log('Have a good day!');
    }
  }).catch(e => {
    console.error(chalk.red(`> Project init failed.`));
    console.error(e);
  })
};
