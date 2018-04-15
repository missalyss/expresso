var express = require('express')
var app = express()
var port = process.env.PORT || 3000
var trainsResource = require('./trains.js')

//set port on terminal like dis: PORT = 1337 node.js
//it'll assign this server to 1337.
//process.env.PORT is most useful when i'm using someone elses server. now my stuff is on their port, and i don't know what their number is.
//any port number under 1024 is reserved by my computer. there are 65,000 ports on my comp
app.get('/', greeting) //greeting isn't greeting() because .get is already calling it. we can't change the parameters of another library's methods. //user calls http localhost:3000/
app.use(errorHandler)//.use is run everytime no matter what. (like .listen)



//middleware
function getTrain (req, res, next) {
  //need to have next! and call it within the function if you want to use it. it won't go to the next funciton if you don't do it.
  var index = req.params.index
  var trainSolo = trainsResource[index] //but how are we going to return 'train' in the next function without making it more global? attach it to req
  req.trainSolo = trainSolo
  next()
}

//we create an error handler and if htere are any errors, it is used for


function retrieveTrain (req, res, next) {
  var index = req.params.index
  var train = trains[index]
  var error = { status: 404, message: `No train found for index ${index}.` }

  req.train = train
  req.train ? next() : next(error) //ANYTIME that something is passed into next(), it is seen as the FOURTH parameter in a callback function (actually i'm not sure about this but this will help me remember). so it AUTOMATICALLY looks for an error handler, which is any function with a 4th paramter
}

function errorHandler (err, req, res, next) {
  res.status(err.status).json(err)
}
