const gulp = require("gulp");
const dree = require("dree");
const fs = require("fs");
const path = require('path');

const root_ = "./stdlib";
const output = "stdlib.json";

const options = {
    extensions: ["code"]
};

gulp.task('pack-stdlib', function (done) {
    var stdlib = {};
    dree.scan(root_, options, function (file) {
        const content = fs.readFileSync(file.path).toString();
        stdlib[file.relativePath] = content;
    });

    fs.writeFileSync(path.resolve(__dirname, output), JSON.stringify(stdlib));
    done();
});