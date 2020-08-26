exports.webhook   = require('./trigger-function');
exports.example   = require('./example');
exports.email     = require('./email');
exports.admin     = require('./admin');

/**
 * NOTE
 * Import the entire module into a single variable,
 * and use it to access the module exports
 */

// import * as trigger from './trigger-function';