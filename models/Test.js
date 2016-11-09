"use strict";
const core_1 = require('../core');
class Test extends core_1.Model {
    constructor() {
        super(...arguments);
        this.test = 'test';
    }
    setPassword(password) {
        console.log('called', password);
        this.password = password;
        this.test = 'changed';
        console.log(this);
        console.log(this.password);
    }
}
exports.Test = Test;
