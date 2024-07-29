// get input argument as string
// split input argument on delimiter ';'
// return array of strings

import fs from 'fs/promises';

const modifiedFiles = process.argv[2].split(';');

const requestPayload = [];

for (const file of modifiedFiles) {
    console.log('read and send this file:', file);
    const fileContent = await fs.readFile(file, 'utf8');
    const kind = file.split('.json')[0]
    requestPayload.push({ kind, filename: file, schemaValue: JSON.parse(fileContent) });
}

console.log('requestPayload:', requestPayload);

