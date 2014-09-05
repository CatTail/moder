var path = require('path'),
    assert = require('assert'),
    indexjs = require('../');

describe('index.js', function() {
    var models = indexjs(__dirname + '/models');

    it('should access all modules in directory', function () {
        assert.equal(models.user, 'user');
    });

    it('should lazy load modules', function() {
        assert.equal(!!require.cache[__dirname + '/models/user.js'], true);
        assert.equal(!!require.cache[__dirname + '/models/blog.js'], false);
    });

    it('should filter certain files', function() {
        assert.equal(models.index, undefined);
    });
});
