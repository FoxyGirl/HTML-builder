const fs = require('fs');
const path = require('path');
const { stdin, stdout } = process;

const filePath = path.join(__dirname, 'text.txt');
const writeableStream = fs.createWriteStream(filePath, 'utf-8');

const greetingMessage = '> Hello! Enter your text\n\n';
const goodbyeMessage = '\n> Goodbye! \n> File text.txt with your text is created\n';

const sayGoodbye = () => {
  stdout.write(goodbyeMessage);
  writeableStream.end();
  process.exit();
};

stdout.write(greetingMessage);

stdin.on('data', (newData) => { 
  if (newData.toString().trim() === 'exit') {
    sayGoodbye();
  } else {
    writeableStream.write(newData);
  }
});

process.on('SIGINT', sayGoodbye);

writeableStream.on('error', error => console.log('Error', error.message));