var fs = require('fs'),
    path = require('path');

var exports = module.exports = function(dir) {
    var modules = {};

    fs.readdirSync(dir).forEach(function(filename) {
        // filter index and dotfiles
        if (filename !== 'index.js' && filename[0] !== '.') {
            var moduleName = path.basename(filename, path.extname(filename));
            var modulePath = path.join(dir, moduleName);
            // lazy load
            Object.defineProperty(modules, moduleName, {
                get: function() {
                    return require(modulePath);
                }
            });
        }
    });

    return modules;
};
