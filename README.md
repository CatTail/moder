# moder

[![Build Status](https://travis-ci.org/CatTail/moder.svg?branch=master)](https://travis-ci.org/CatTail/moder)

Module loader

## Installation

    npm install moder

## Usage

Example directory structure

    models
    ├── index.js
    ├── user.js
    └── blog.js

In index.js

    module.exports = require('moder')(__dirname);

Models will automatically loaded

    var models = require('./models');
    models.user == require('./models/user');

## License

MIT
