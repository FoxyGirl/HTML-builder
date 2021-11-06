const { mergeCSS, handleError } = require('../05-merge-styles');
const { copyDir } = require('../04-copy-directory');
const path = require('path');
const fsPromises = require('fs').promises;

const srcCSSPath = path.join(__dirname, 'styles');
const srcAssetsPath = path.join(__dirname, 'assets');
const distPath = path.join(__dirname, 'project-dist');

const distCSSPath = path.join(distPath, 'style.css');
const distHTMLPath = path.join(distPath, 'index.html');
const distAssetsPath = path.join(distPath, 'assets');

const componentsPath = path.join(__dirname, 'components');
const templateHTMLPath = path.join(__dirname, 'template.html');

const main = async () => {
  await fsPromises
    .rm(distPath, { force: true, recursive: true })
    .catch(handleError);

  await fsPromises.mkdir(distPath, { recursive: true }).catch(handleError);

  mergeCSS(srcCSSPath, distCSSPath).catch(handleError);
  copyDir(srcAssetsPath, distAssetsPath).catch(handleError);

  let html = await fsPromises
    .readFile(templateHTMLPath, { encoding: 'utf-8' })
    .catch(handleError);

  const allTemplates = html
    .match(/({{\w+}})/g)
    .map((templ) => templ.slice(2, templ.length - 2));

  while (allTemplates.length) {
    const template = allTemplates.pop();
    const templatePath = path.join(componentsPath, `${template}.html`);
    const templateHtml = await fsPromises
      .readFile(templatePath, {
        encoding: 'utf-8',
      })
      .catch(handleError);
    html = html.replace(`{{${template}}}`, templateHtml);
  }

  fsPromises.writeFile(distHTMLPath, html).catch(handleError);
};

main();
