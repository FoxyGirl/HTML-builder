const path = require('path');
const fsPromises = require('fs').promises;

const srcPath = path.join(__dirname, 'files');
const destPath = path.join(__dirname, 'files-copy');

const handleError = (err) => console.error('\n======== ERROR \n', err);

const copyDir = async (src, dest) => {
  await fsPromises
    .rm(dest, { force: true, recursive: true })
    .catch(handleError);

  await fsPromises.mkdir(dest, { recursive: true }).catch(handleError);

  const items = await fsPromises
    .readdir(src, { withFileTypes: true })
    .catch(handleError);

  if (Array.isArray(items)) {
    items.forEach((item) => {
      const newSrcPath = path.join(src, item.name);
      const newDestPath = path.join(dest, item.name);
      if (item.isFile()) {
        fsPromises.copyFile(newSrcPath, newDestPath).catch(handleError);
      }
      if (item.isDirectory()) {
        copyDir(newSrcPath, newDestPath);
      }
    });
  }
};

copyDir(srcPath, destPath);
