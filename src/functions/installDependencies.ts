//! esm
import { success } from './success';
import { spawn } from 'child_process';

//! INSTALL DEPENDENCIES

const os = process.platform;
const npmCommand = os === 'win32' ? 'npm.cmd' : 'npm';

const installDependencies = async (extraPackages, projectName) => {
  const name = projectName;

  console.clear();

  try {
    console.log('  🧩 Installing dependencies...');

    await new Promise<void>((resolve, reject) => {
      const install = spawn(npmCommand, ['install'], {
        stdio: 'inherit'
      });

      install.on('close', (code) => {
        if (code !== 0) {
          reject(new Error('Error installing dependencies'));
        } else {
          resolve();
        }
      });
    });

    // If there are no extra packages, end the function successfully
    if (!extraPackages) return success(name);

    // If there are extra packages, proceed to install them
    if (extraPackages.length > 0) {
      console.log('  🧩 Installing extra packages...');

      // Create a new promise to handle the installation process
      await new Promise<void>((resolve, reject) => {
        // Start the installation process
        const installExtra = spawn(npmCommand, ['install', ...extraPackages!], {
          stdio: 'inherit'
        });

        // When the installation process closes, check if there was an error
        installExtra.on('close', (code) => {
          // If the exit code is not 0, an error occurred
          if (code !== 0) {
            reject(new Error('Error installing extra packages'));
          } else {
            // If the exit code is 0, the installation was successful
            success(name);
            resolve();
          }
        });
      });
    } else {
      // If there are no extra packages, end the function successfully
      success(name);
    }
  } catch (error) {
    console.error('  😨 An error occurred while installing packages.\n', error);
    process.exit(1);
  }
};

export { installDependencies };
