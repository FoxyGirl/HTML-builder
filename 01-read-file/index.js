const fs = require('fs');
const path = require('path');
const stdout = process.stdout;

const filePath = path.join(__dirname, 'text.txt');
const stream = fs.createReadStream(filePath, 'utf-8');

let data = '';

stream.on('data', partData => data += partData);
stream.on('end', () => stdout.write(data));
stream.on('error', error => console.log('Error', error.message));
