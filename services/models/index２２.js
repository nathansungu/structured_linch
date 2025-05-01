const fs = require('fs');
const path = require('path');

const models = {};

fs.readdirSync(__dirname).forEach(file => {
    if (file !== 'index.js' && file.endsWith('.js')) {
        const modelName = path.basename(file, '.js');
        models[modelName] = require(path.join(__dirname, file));
    }
});

module.exports = models;
