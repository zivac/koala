"use strict";
var WatchJS = require("watchjs");
var mongodb = require("mongodb");
var watch = WatchJS.watch;
var unwatch = WatchJS.unwatch;
var ObjectId = mongodb.ObjectId;
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
class Model {
    constructor(init) {
        var id;
        if (typeof init === "object") {
            for (var key in init) {
                if (key === "_id" || key === "id")
                    id = init[key];
                else {
                    this[key] = init[key];
                    if (this.constructor['_schema'].schema.obj[key] && this.constructor['_schema'].schema.obj[key]['defaultsTo']) {
                        watch(this, key, (key, operation, value) => {
                            console.log(value, operation, key);
                            if (operation == 'set')
                                this[key] = init[key];
                            unwatch(this, key);
                        });
                    }
                }
            }
        }
        else if (typeof init === "string" || typeof init === "number") {
            id = init;
        }
        if (id) {
            if (typeof window === "undefined")
                this._id = new ObjectId(id);
            else
                this._id = id;
        }
    }
    _validate() { }
    save() {
        //return modelService.save(this.constructor, this.constructor.name, this);
        return new Promise((resolve, reject) => {
            var schema = this.constructor['_schema'];
            var instance = new schema(this);
            instance.save((err) => {
                if (err) {
                    console.log(JSON.stringify(err));
                    reject(err);
                }
                else
                    resolve();
            });
        });
    }
    delete() {
        //return modelService.delete(this.constructor, this.constructor.name, this);
        return new Promise((resolve, reject) => {
            var schema = this.constructor['_schema'];
            schema.remove({ _id: this._id }, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
    }
    static find(filters, bla) {
        //return modelService.find(this, this.name, filters);
        return new Promise((resolve, reject) => {
            var schema = this['_schema'];
            var lala = bla['select'];
            delete bla['select'];
            schema.find(filters, lala, bla).exec((err, items) => {
                if (err)
                    reject(err);
                var objects = items.map(item => new this(item));
                console.log(objects);
                resolve(objects);
            });
        });
    }
    static findOne(filters) {
        //return modelService.findOne(this, this.name, filters);
        return new Promise((resolve, reject) => {
            var schema = this['_schema'];
            schema.findOne(filters, (err) => {
                if (err)
                    reject(err);
                else
                    resolve();
            });
        });
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
