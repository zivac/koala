"use strict";
function Controller(properties) {
    return (target) => {
        target['_metadata'] = properties;
    };
}
exports.Controller = Controller;
function Route(properties) {
    return function (target, propertyKey, descriptor) {
        target[propertyKey]._metadata = properties;
    };
}
exports.Route = Route;
function format(format) {
    return function (target, propertyKey, descriptor) {
        if (target['_metadata'].propertyKey)
            target['_metadata'].propertyKey.format = format;
        else
            target['_metadata'].propertyKey = { format: format };
    };
}
exports.format = format;
