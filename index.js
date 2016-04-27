var fs = require('fs'),
    path = require('path'),
    camelcase = require('camelcase');

var exports = module.exports = function(dir, options) {
    var modules = {};
    options = options || {};
    if (typeof options === 'function') {
        options = {init: options};
    } else {
        options = merge(options, {
            lazy: true,
            init: function(mod){ return mod; }
        });
    }

    fs.readdirSync(dir).forEach(function(filename) {
        // filter index and dotfiles
        if (filename !== 'index.js' && filename[0] !== '.') {
            var moduleName = path.basename(filename, path.extname(filename));
            var modulePath = path.join(dir, moduleName);
            // lazy load
            if (options.lazy) {
                Object.defineProperty(modules, camelcase(moduleName), {
                    get: function() {
                        return options.init(require(modulePath));
                    }
                });
            } else {
                modules[moduleName] = options.init(require(modulePath));
            }
        }
    });

    return modules;
};

function merge(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key) && obj[key] === undefined) {
            obj[key] = src[key];
        }
    }
    return obj;
}
