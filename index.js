var fs = require('fs')
var path = require('path')
var camelcase = require('camelcase')
var pascalcase = require('uppercamelcase')

module.exports = load

function load(dir, options) {
    var modules = {}

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
        default:
            options.naming = identify
            break
    }
    options = merge(options, {
        lazy: true,
        init: identify,
    })

    fs.readdirSync(dir).forEach(function(filename) {
        // filter index and dotfiles
        var stat = fs.statSync(path.join(dir, filename))
        var isModule = stat.isFile() && path.extname(filename) === '.js' && 
            filename !== 'index.js' && filename[0] !== '.'
        if (stat.isDirectory() || isModule) {
            var moduleName = path.basename(filename, path.extname(filename))
            var modulePath = path.join(dir, moduleName)
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
