const fs = require('fs');
let baseDir = process.cwd();
if (!fs.existsSync(`${baseDir}../../package.json`)) {
    console.log('is not in local project dir! no need install!');
    return
}
let typesFolder = `${baseDir}/../@types`;
let targetPath = `${baseDir}/../@types/wxlib`;
if (!fs.existsSync(typesFolder)) {
    fs.mkdirSync(typesFolder);
}
if (!fs.existsSync(targetPath)) {
    fs.mkdirSync(targetPath);
}
fs.copyFileSync(`${baseDir}/wxlib/types.d.ts`, `${targetPath}/index.d.ts`);