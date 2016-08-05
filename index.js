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
        // custom filter
        if (options.filter(filename)) {
            return
        }

        var stat = fs.statSync(path.join(dirname, filename))
        if (stat.isDirectory()) {
            // filter directory without index.js
            try {
                fs.accessSync(path.join(dirname, filename, 'index.js'))
            } catch (err) {
                return
            }
        } else {
            // filter not .js or temporary files
            var isModule = stat.isFile() && path.extname(filename) === '.js' && filename !== 'index.js' && filename[0] !== '.'
            if (!isModule) {
                return
            }
        }

        var moduleName = path.basename(filename, path.extname(filename))
        var modulePath = path.join(dirname, moduleName)
        var exportName = options.naming(moduleName)
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
