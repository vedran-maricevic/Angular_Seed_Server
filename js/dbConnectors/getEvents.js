/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/5/13
 * Time: 2:56 PM
 * To change this template use File | Settings | File Templates.
 */

var Q = require('q');
var pool = require('../database_pool_provider.js');


exports.getEventData = function (data) {
    var deferred = Q.defer();
    var eventCollection = pool.getDbCollection('Events');//TO DO Move this to config file
    eventCollection.findOne({"id":data},
        function (err, docs) {
            if (!err) {
                deferred.resolve(docs);
                console.log('INFO(getEvents Method): Got the data !!!!')
            } else {
                deferred.reject('INFO(getEvents Method): Failed to get the data');
            }
        }
    );

    return deferred.promise;
};

exports.countCollection  = function() {
    var deferred = Q.defer();
    var eventCollection = pool.getDbCollection('Events');
    eventCollection.find( {},
        function (err, docs) {
            if (!err) {
                     /*   docs.forEach( function(myDoc) {
                            console.log( "user: " + myDoc.name );
                        });*/

                deferred.resolve(docs);
                console.log('INFO(getEvents Method): Got the list in collection !!!!')

            } else {
                deferred.reject('INFO(getEvents Method): Failed to get the collection number');
            }
        }
    );
    return deferred.promise;

};

exports.getAllCollectionNames = function () {
    var deferred = Q.defer();
    var resultSet = [];

var allCollectionNames = pool.getDbCollection('Events');
    allCollectionNames.find({name: {$not: {$size: 0}}}, function(err, resultCursor) {
    resultCursor.each(function(err, result) {

             if(result !== null){
                 var tempObject = {
                     name: result.name
                 };

                 resultSet.push(tempObject);
                 console.log(result.name);
             }
        deferred.resolve(resultSet);
    });

});
    return deferred.promise;
};

exports.getSpecificEvent = function (eventName) {
    var deferred = Q.defer();
    var eventCollection = pool.getDbCollection('Events');//TO DO Move this to config file
    eventCollection.findOne({"name":eventName},
        function (err, docs) {
            if (!err) {
                deferred.resolve(docs);
                console.log('INFO(Specific Event Name requested): Got the data !!!!')

            } else {
                deferred.reject('INFO(Specific Event Name requested): Failed to get the data');
            }
        }
    );

    return deferred.promise;
};