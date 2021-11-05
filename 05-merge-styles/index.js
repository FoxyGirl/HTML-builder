const path = require('path');
const fsPromises = require('fs').promises;

const srcPath = path.join(__dirname, 'styles');
const destPath = path.join(__dirname, 'project-dist', 'bundle.css');

const handleError = (err) => console.error('\n======== ERROR \n', err);

const mergeCSS = async () => {
  const files = await fsPromises
    .readdir(srcPath, { withFileTypes: true })
    .then((data) =>
      data.filter((item) => {
        const parsedFile = path.parse(item.name);
        return parsedFile.ext.slice(1) === 'css';
      })
    )
    .catch(handleError);

  await fsPromises
    .writeFile(destPath, '', { encoding: 'utf-8' })
    .catch(handleError);

  if (!Array.isArray(files)) {
    throw Error('ERROR: There is no files array!');
  }

  while (files.length) {
    const file = files.pop();

    const data = await fsPromises
      .readFile(path.join(srcPath, file.name), { encoding: 'utf-8' })
      .catch(handleError);

    await fsPromises
      .appendFile(destPath, `${data}\n`, { encoding: 'utf-8' })
      .catch(handleError);
  }
};

mergeCSS().catch(handleError);
