"use strict";

var MongoDb = require('mongodb'),
    Db = require('mongodb').Db,
    Server = require('mongodb').Server,
    MongoClient = require('mongodb').MongoClient;

var applicationConfig = require('./../config/applicationMainConfig.js');

var url = applicationConfig.db.connectionurl;

var dbMongoObject;

exports.initPool = function (callback) {
    MongoClient.connect(url, {
        db: {w: 1},
        server: {
            'auto_reconnect': true,
            'poolSize': applicationConfig.db.poolsize
        }
    }, function (err, db) {
        if (err) {
            //callback(err);
            //return;
            console.log('Database Connection Pool NOT initialized!!!');
            throw err;
        }
        dbMongoObject = db;
        console.log('Database Connection Pool initialized');
        callback(null);
    });
};

exports.releasePool = function () {
    if (dbMongoObject) {
        dbMongoObject.close();
        dbMongoObject = null;
    }
};

exports.getDbObject = function () {
    return dbMongoObject;
};

exports.getDbCollection = function (collection) {
    var db = this.getDbObject();
    return MongoDb.Collection(db, collection);
};



