var walk = require('walk');
var fs = require('graceful-fs');
var stripBom = require('strip-bom');
var Readable = require('stream').Readable;
var File = require('vinyl');
var util = require('util');
var Buffer = require('buffer').Buffer;
var through2 = require('through2');

function AppJsSrcStream(dir){
    Readable.call(this, {
        objectMode: true
    });

    this.dir = dir;
}

util.inherits(AppJsSrcStream, Readable);

AppJsSrcStream.prototype.initWalker = function(){
    var baseDir = process.cwd() + '/' + this.dir;
    var files = [];
    var stream = this;

    var jsExt = /\.js$/;

    this.walker = walk.walk(baseDir)
        .on('directory', function(root, fileStats, next){
            var moduleFile = root + '/' + fileStats.name + '/' + fileStats.name + '.js';

            // load module first?
            fs.lstat(moduleFile, function(err, stat) {
                // Ignore errors here as we don't care if the file doesn't exist.
                if(stat){
                    files.push(moduleFile);

                    stream.push(new File({
                        cwd: process.cwd(),
                        base: baseDir,
                        path: moduleFile,
                        stat: stat
                    }));
                }

                next();
            });
        })
        .on('file', function(root, fileStats, next){
            if(! jsExt.test(fileStats.name)){
                return next();
            }

            var filePath = root + '/' + fileStats.name;

            if(files.indexOf(filePath) === -1) {
                files.push(filePath);

                stream.push(new File({
                    cwd: process.cwd(),
                    base: baseDir,
                    path: filePath,
                    stat: fileStats
                }));
            }

            next();
        })
        .on('end', function(){
            stream.push(null);
        });
};

AppJsSrcStream.prototype._read = function(){
    console.log('_read', this.readNext !== undefined);

    if(!this.walker){
        this.initWalker();
    }else{
        if(this.readNext) {
            this.readNext();

            this.readNext = null;
        }
    }
};

/**
 * Return new stream of ordered AngularJS source files
 *
 * @param dir
 * @param options
 * @returns {AppJsSrcStream}
 */
function getAppJsSrc (dir, options) {
    var stream = new AppJsSrcStream(dir);

    if(!options){
        options = {};
    }

    if(options.read === undefined || options.read){
        stream = stream.pipe(through2.obj(bufferFile));
    }

    return stream;
}

/**
 * Taken from vinyl-fs
 *
 * https://github.com/wearefractal/vinyl-fs/blob/master/lib/src/getContents/bufferFile.js
 *
 * @param file {File}
 * @param enc {string}
 * @param cb {function}
 */
function bufferFile(file, enc, cb){
    fs.readFile(file.path, function (err, data) {
        if (err) {
            return cb(err);
        }
        file.contents = stripBom(data);
        cb(null, file);
    });
}

getAppJsSrc.AppJsSrcStream = AppJsSrcStream;

module.exports = getAppJsSrc;
