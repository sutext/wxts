const fs = require('fs');
let baseDir = process.cwd();
let typesFolder = `${baseDir}/../@types`;
let targetPath = `${baseDir}/../@types/wxts-types`;
if (!fs.existsSync(typesFolder)) {
    fs.mkdirSync(typesFolder);
}
if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
}
fs.copyFileSync(`${baseDir}/types.d.ts`, `${targetPath}/index.d.ts`);