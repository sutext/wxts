const fs = require('fs');
let baseDir = process.cwd();
if (!fs.existsSync(`${baseDir}/../../package.json`)) {
    console.log('Target is not in local project dir! So no need to install!');
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
fs.copyFileSync(`${baseDir}/wxlib/index.d.ts`, `${targetPath}/index.d.ts`);
fs.copyFileSync(`${baseDir}/wxlib/lib.wx.d.ts`, `${targetPath}/lib.wx.d.ts`);
fs.copyFileSync(`${baseDir}/wxlib/lib.wx.es6.d.ts`, `${targetPath}/lib.wx.es6.d.ts`);