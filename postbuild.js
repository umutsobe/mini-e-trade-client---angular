const exec = require("child_process").exec;
const fs = require("fs");
const path = require("path");

const browserPath = "./dist/client-angular/browser/"; // uygulamanızın client tarafı neredeyse o path'i buraya yazın. sonuna / eklemeyi unutmayın

const files = getFilesFromPath(browserPath, ".css");
let data = [];

if (!files && files.length <= 0) {
  console.log("cannot find style files to purge");
  return;
}

for (let f of files) {
  const originalSize = getFilesizeInKiloBytes(browserPath + f) + "kb";
  var o = { file: f, originalSize: originalSize, newSize: "" };
  data.push(o);
}

console.log("Run PurgeCSS...");

exec(
  `purgecss -css ${browserPath}/*.css --content ${browserPath}/index.html ${browserPath}/*.js -o ${browserPath}`,
  function (error, stdout, stderr) {
    console.log("PurgeCSS done");
    console.log();

    for (let d of data) {
      // get new file size
      const newSize = getFilesizeInKiloBytes(browserPath + d.file) + "kb";
      d.newSize = newSize;
    }

    console.table(data);
  }
);

function getFilesizeInKiloBytes(filename) {
  var stats = fs.statSync(filename);
  var fileSizeInBytes = stats.size / 1024;
  return fileSizeInBytes.toFixed(2);
}

function getFilesFromPath(dir, extension) {
  let files = fs.readdirSync(dir);
  return files.filter((e) => path.extname(e).toLowerCase() === extension);
}
