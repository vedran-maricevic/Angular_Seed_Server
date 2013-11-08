/**
 * Created with JetBrains WebStorm.
 * User: VedranMa
 * Date: 11/6/13
 * Time: 3:44 PM
 * To change this template use File | Settings | File Templates.
 */


var express = require('express')
    , mongoskin = require('mongoskin')

var app = express()
app.use(express.bodyParser())


//192.168.1.200:27017/angular_events
var db = mongoskin.db('192.168.1.200:27017/angular_events', {safe:true});

app.param('collectionName', function(req, res, next, collectionName){
    req.collection = db.collection(collectionName)
    return next()
})
app.get('/', function(req, res) {
    console.log("I am hit in console: please select a collection, e.g., /collections/messages ");
    res.send('please select a collection, e.g., /collections/messages')
})

app.get('/collections/:collectionName', function(req, res) {
    req.collection.find({},{limit:10, sort: [['_id',-1]]}).toArray(function(e, results){
        if (e) return next(e)
        res.send(results)
    })
})

app.post('/collections/:collectionName', function(req, res) {
    req.collection.insert(req.body, {}, function(e, results){
        if (e) return next(e)
        res.send(results)
    })
})


 // ORIGINAL THAT WORKS
app.get('/collections/:collectionName/:id', function(req, res) {
    req.collection.findOne({name: req.collection.id(req.params.id)},
        function(e, result){
        if (e) return next(e)
        res.send(result)
    })
})


app.put('/collections/:collectionName/:id', function(req, res) {
    req.collection.update({_id: req.collection.id(req.params.id)}, {$set:req.body}, {safe:true, multi:false}, function(e, result){
        if (e) return next(e)
        res.send((result===1)?{msg:'success'}:{msg:'error'})
    })
})
app.del('/collections/:collectionName/:id', function(req, res) {
    req.collection.remove({_id: req.collection.id(req.params.id)}, function(e, result){
        if (e) return next(e)
        res.send((result===1)?{msg:'success'}:{msg:'error'})
    })
})

app.listen(3000)