const { stat } = require('fs');
const { readdir } = require('fs').promises;
const path = require('path');

const dirPath = path.join(__dirname, 'secret-folder');

// const convertToKb = (bytes) => (bytes / 1024).toFixed(3);

const main = async () => {
  const files = await readdir(dirPath, { withFileTypes: true });

  for (const file of files) {
    stat(path.join(dirPath, file.name), (err, stats) => {
      if (err) {
        throw err;
      }

      if (stats.isFile()) {
        const parseFile = path.parse(file.name);
        console.log(
          `${parseFile.name} - ${parseFile.ext.slice(1)} - ${stats.size}b`
        );
      }
    });
  }
};

main().catch(console.error);
