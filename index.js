var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var port = process.env.PORT || 8008
var rq = require("amqplib/callback_api");

app.use(bodyParser.urlencoded({
	extended: true
}));

app.listen(port, function(){
	console.log("Server Running on "+ port);
});

app.all('/*', function(req, res, next) { 
	res.header("Access-Control-Allow-Origin", "*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization, content-type, Origin, X-Requested-With, Content-Type, Accept");
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	}
	else {
		next();
	}
});

app.get('/data', function(req, resp){
	var fs = require("fs");
	var file = fs.readFileSync("data.json");
	var data = JSON.parse(file);
	resp.send(data);
});

app.post("/queue", function(req, resp){
	var msg = req.body;
	resp.sendStatus(200);
	console.log(msg);

	rq.connect('amqp://localhost', function(err, con){
		con.createChannel(function(err, chan){
			var q = "msgQueue";
			chan.assertQueue(q, {duration: false});
			chan.sendToQueue(q, new Buffer(JSON.stringify(msg)));
		})
	});

});