"use strict";
const mongodb_1 = require('mongodb');
class MongoService {
    constructor() {
        this.ObjectId = mongodb_1.ObjectID;
        this.url = 'mongodb://localhost:27017/test';
        console.log('connecting to mongo');
        mongodb_1.MongoClient.connect(this.url, (err, db) => {
            // Use the admin database for the operation
            console.log('connection established');
            this.db = db;
        });
    }
    save(constructor, collection, document) {
        return this.db.collection(collection).save(document);
    }
    delete(constructor, collection, document) {
        if (!document['_id'])
            throw new Error('can not delete item');
        return this.db.collection(collection).deleteOne({ '_id': document['_id'] });
    }
    find(constructor, collection, document) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).find(document).toArray(function (err, items) {
                if (err)
                    reject(err);
                else
                    resolve(items.map((item) => { return new constructor(item); }));
            });
        });
    }
    findOne(constructor, collection, document) {
        return new Promise((resolve, reject) => {
            this.db.collection(collection).findOne(document).then(function (item) {
                resolve(item);
            }).catch(function (err) {
                reject(err);
            });
        });
    }
}
exports.MongoService = MongoService;
