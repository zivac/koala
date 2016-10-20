"use strict";
function Controller(properties) {
    return (target) => {
        target['_metadata'] = properties;
    };
}
exports.Controller = Controller;
function Route(properties) {
    return function (target, propertyKey, description) {
        target[propertyKey]._metadata = properties;
    };
}
exports.Route = Route;
