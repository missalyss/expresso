var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var port = process.env.PORT || 3000
var trainsResource = require('./trains.js')

/////////////////////////////////

app.use(bodyParser.json())//this is for stuff on the way in. (for requests, they are all messy but this turns it into a json for me.) //this is why i send things with a .json instead of with a .send now

app.get('/trains', filterTrains, trainsIndex)
app.get('/trains/:index', trainsShow)
app.delete('/trains/:index', deleteMe)

app.post('/trains', parseBody, trainsCreate)

app.use(errorHandler)
app.listen(port, nowListening)

///////////////////////////////


function filterTrains (req, res, next) {
    var num = parseInt(req.query.number_of_cars)
    if (num) {
        req.trains = trains.filter(train =>   train.number_of_cars === num)
    } else {
        req.trains = trains
    }
    next()
}

function trainsIndex(req, res){
    res.json(trainsResource)
}

function trainsShow(req, res) {
    var index = req.params.index
    var trainSolo = trainsResource[index]
    if  (!trainSolo){
        res.status(404).send({message:`No train found for index ${index}.`})
    } else {
        res.status(210).send(trainSolo)
    }
}

function trainsCreate (req, res) {
    var train = req.body
    trains.push(train)
    res.status(201).json(train)
  }

// function parseBody (req, res, next) {
//     var body = []
//     req.on('data', function(data) {
//         body.push(data)
//     }).on('end', function() {
//         req.body = JSON.parse(body.join(''))
//         req.body.number_of_cars = parseInt(req.body.number_of_cars)
//         next()
//     })
// }


function deleteMe(req, res) {
    var index = req.params.index
    var trainSolo = trainsResource[index]
    if  (!trainSolo){
      res.status(404).send({message:`No train found for index ${index}.`})
    } else {
      trainSolo = trainsResource.splice(index, 1)
      res.status(210).send(trainSolo)
    }
}

function errorHandler(err, req, res, next) {
    res.status(err.status).json(err)
    next()
}

function nowListening() {
    console.log(`Now listening on localport:${port}!`)
}
