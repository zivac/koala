"use strict";
const core_1 = require('../core');
class Test extends core_1.Model {
    constructor() {
        super(...arguments);
        this.class = 'default';
        this.setPassword = function (password) {
            this.password = password;
        };
    }
}
exports.Test = Test;
