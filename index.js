var fs = require('fs')
var path = require('path')
var camelcase = require('camelcase')
var pascalcase = require('uppercamelcase')

/**
 * If options is function, it will be used as options.init
 *
 * @param {Function} options.init Initialize target module
 * @param {string} options.naming Exported module name conversion, support camelcase and pascalcase
 * @param {boolean} options.lazy Whether to lazy load module
 * @param {Function} options.filter Filter unwanted modules
 * @param {Function} options.exports Load modules into custom object
 */
module.exports = function load(dirname, options) {
    options = options || {}

    if (typeof options === 'function') {
        options = {init: options}
    }

    switch (options.naming) {
        case 'camel':
            options.naming = camelcase
            break
        case 'pascal':
            options.naming = pascalcase
            break
    }

    // default options
    options = merge(options, {
        init: identify,
        naming: identify,
        lazy: true,
        filter: function(modulePath) { return false },
    })

    var modules = options.exports || {}
    fs.readdirSync(dirname).forEach(function(filename) {
        // filter index and dotfiles
        var stat = fs.statSync(path.join(dirname, filename))
        var isModule = stat.isFile() && path.extname(filename) === '.js' && filename !== 'index.js' && filename[0] !== '.'
        var moduleName = path.basename(filename, path.extname(filename))
        var modulePath = path.join(dirname, moduleName)
        var exportName = options.naming(moduleName)
        if ((stat.isDirectory() || isModule) && !options.filter(moduleName, modulePath, exportName)) {
            // lazy load
            if (options.lazy) {
                Object.defineProperty(modules, exportName, {
                    get: function() {
                        return options.init(require(modulePath))
                    }
                })
            } else {
                modules[exportName] = options.init(require(modulePath))
            }
        }
    })
    return modules
}

function merge(obj, src) {
    for (var key in src) {
        if (src.hasOwnProperty(key) && obj[key] === undefined) {
            obj[key] = src[key]
        }
    }
    return obj
}

function identify(value) {
    return value
}
