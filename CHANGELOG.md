# CHANGELOG

Return to [README.md](../../README.md)

## [0.2.4] - 22/03/2024

### Added

Rsbuild support
Rspack support

### Updated

express-ts-transform to 0.0.11 version

## [0.2.3] - 20/03/2024

### Added

Flag to specify the project to generate (-p) closed (#2)

## [0.2.0] - 11/03/2024

### Fixed

Multiselect search engine was fixed to work properly.

## [0.1.29] - 08/03/2024

### Fixed

-c -t flags were fixed to work properly.

### Added

Custom project generator example was added to the project.

## [0.1.25] - /03/2024

### Added

- Added @rollup/plugin-terser to generate a minified bundle and reduce the final size of the project.

## [0.1.24] - 05/03/2024

### Updated

- Part of the code was organized for maintainability

- Remove the `@expressTSTransform.ts` file from the project

### Fixed

- Fixed latency when using an external template

## [0.1.22] - 01/03/2024

### Added

- Catching local templates to simplify the execution of the project.

## [0.1.20] - 28/02/2024

### Added

- Now you can change the default templates directory with the `-t` flag to use your own templates.

## [0.1.19] - 26/02/2024

### Added

- express-ts-transform package
- yargs package

## [0.1.16] - 23/02/2024

### Added

- Qwik support
- Tauri support
- pnpm as default package manager
- Local configuration support
- Rollup as a default bundler

###

# [0.1.15] - 16/02/2024

### Added

- Search engine to autocomplete technology searches

## [0.1.12] - 09/01/2024

### Updated

- Add Starlight, Hono, and Express with TypeScript support.
- Added base API for building custom generators.

## [0.1.10] - 13/12/2023

### Updated

- Update [.npmignore](.npmignore) file to ignore the `vault` folder.

- Update templates to use the [cronos-utils](https://github.com/cronos-js/cronos-utils) latest version (canary version).

## [0.1.9] - 13/12/2023

### Added

- Added [Vue](https://vuejs.org/) and [Express](https://expressjs.com/) support to the project in the canary version (you can use it with the `--canary` flag).

- Added [CI](./ci/) folder to the project to prepare the project for the continuous integration in the future.

- Added [Cronos User Repository]() to generate projects.
  For now only available in the canary version.

### Updated

- [React](https://reactjs.org/) in the canary version was updated to improve the default styles.

- [README.md](../../README.md) file was updated to show the Table of Contents.

- [CHANGELOG.md](./CHANGELOG.md) "Changed" word was changed to "Updated" to show the changes in the project.

## [0.1.0] - Unknow

### Added

- Now you can add extra packages to your project when you create it.

- CHANGELOG.md file was added to inform about the changes in the project.

### Updated

- Now Esbuild is used to build this project.

- README.md file was updated to show new information about the project and how to use it.

### Removed

- SWC was removed from this project.
