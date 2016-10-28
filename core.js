"use strict";
const MongoService_1 = require('./core/MongoService');
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
var modelService = new MongoService_1.MongoService();
class Model {
    constructor(init) {
        var id;
        if (typeof init === "object") {
            for (var key in init) {
                if (key === "_id" || key === "id")
                    id = init[key];
                else
                    this[key] = init[key];
            }
        }
        else if (typeof init === "string" || typeof init === "number") {
            id = init;
        }
        if (id) {
            if (typeof window === "undefined")
                this._id = new modelService.ObjectId(id);
            else
                this._id = id;
        }
    }
    _validate() {
    }
    save() {
        return modelService.save(this.constructor, this.constructor.name, this);
    }
    delete() {
        return modelService.delete(this.constructor, this.constructor.name, this);
    }
    static find(filters) {
        return modelService.find(this, this.name, filters);
    }
    static findOne(filters) {
        return modelService.findOne(this, this.name, filters);
    }
}
exports.Model = Model;
/*export function ModelDecorator(properties?: Object) {

    return function(constructor: any) {

        var newConstructor = function(init: any) {
            var object = new constructor();
            var id;
            if(typeof init === "object") {
                for(var key in init) {
                    if(key === "_id" || key === "id") id = init[key];
                    else object[key] = init[key];
                }
            } else if(typeof init === "string" || typeof init === "number") {
                id = init;
            }
            if(id) {
                if(typeof window === "undefined")  object._id = new modelService.ObjectId(id);
                else object._id = id;
            }
            return object;
        }

        //instance functions
        constructor.prototype.save = function() {
            return modelService.save(newConstructor, constructor.name, this);
        }

        constructor.prototype.delete = function() {
            return modelService.delete(newConstructor, constructor.name, this);
        }

        //static functions
        newConstructor['find'] = function(document) {
            return modelService.find(newConstructor, constructor.name, document);
        }

        newConstructor['findOne'] = function(document) {
            return modelService.findOne(newConstructor, constructor.name, document);
        }

        return newConstructor;
    }
}*/ 
