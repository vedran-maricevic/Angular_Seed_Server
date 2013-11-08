"use strict";
var pool = require('../js/database_pool_provider.js');
var eventsUtils = require('../js/dbConnectors/getEvents.js');

//Fixes CORS issues
var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'content-type, Authorization, Content-Length, X-Requested-With, Origin, Accept');

    if ('OPTIONS' === req.method) {
        res.send(200);
    } else {
        next();
    }
};

var application_root = __dirname,
    path = require("path"),
    express = require("express"),
    mongoskin = require('mongoskin'),//TO DO. Use this or database_pool_provider.js? Deffered issue?
    app = express();

app.configure(function () {
    app.set('port', process.env.PORT || 3000);
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(allowCrossDomain);
    app.use(app.router);
});


//**************NOTE********************************************
//Just recently we have found an easier way to connect to MongoDB
//And that is mongoskin
//It is used (more as test) in REST implementation at the end of this file
//Solid MongoDB access and implementation is done in database_pool_provider.js
//and is Instantiated as a callback to Express server


var db = mongoskin.db('192.168.1.200:27017/angular_events', {safe:true});

app.param('collectionName', function(request, response, next, collectionName){
    request.collection = db.collection(collectionName)
    return next()
})

app.post('/courses', function(request, response) {
    console.log("Requested Event with number: " + request.body.id);

    //TO DO: error check  request.body.id
    var result = eventsUtils.getEventData(request.body.id);

    result.then(function (event) {
        response.send(event);
    });
});


app.post('/eventlist', function(request, response) {

    var result = eventsUtils.getAllCollectionNames();

    result.then(function(result) { //Send Event names
        console.log("EventsList is being hit. It is returning: " + result);
        response.send(result);
    })
});

app.post('/getspecificevent', function(request, response) {

    var result = eventsUtils.getSpecificEvent(request.body.name);

       result.then(function (eventDetails){
           response.send(eventDetails);
       });

    console.log("I have received: " + request.body.name);
});


app.post('/getevents', function(request, response) {
    console.log("I have been hit");

    console.log("I have received: " + request.body.name);
    response.send('hello world');
});



//
//  REST-full IMPLEMENTATION STARTS HERE
//
//
   //GET ALL DOCUMENTS
app.get('/collections/:collectionName', function(request, response) {
    request.collection.find({},{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
        if (e) return next(e)
        console.log("response returned");
        response.send(results);
    })
})


//ROOT HAS BEEN HIT
app.get('/', function(request, response) {
    console.log("I was hit here ");
    response.send('please select a collection, e.g., /collections/messages');
})


 //Get Specific event by it's _id from mongo
app.get('/collections/:collectionName/:id', function(request, response) {
    request.collection.findOne({_id: request.collection.id(request.params.id)},
        function(e, result){
            if (e) return next(e)
            console.log("\n" + "Specific Event is being requested.");
            console.log("Event Id: " + result.id);
            console.log("Event Name: " + result.name + "\n");
            response.send(result);
        });
});


pool.initPool(
    function () {
        //////////////////////////////////////////////////////////
        //LAUNCH SERVER///////////////////////////////////////////
        //Make Sure we have Mongo Object before server starts ////
        //////////////////////////////////////////////////////////
        app.listen(3000);
        console.log("Server Started on port: 3000 ");
    });
