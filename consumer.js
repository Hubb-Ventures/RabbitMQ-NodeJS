var rq = require("amqplib/callback_api");
var qs = require("querystring");
var http = require('http');

rq.connect('amqp://localhost', function(err, con){
	con.createChannel(function(err, chan){
		var q = "msgQueue";
		chan.assertQueue(q, {durable: true});
		console.log("Consumer ready to consume");
		chan.consume(q, function(msg){
			var wait = Math.floor((Math.random() * 30) + 1);
			setTimeout(function(){
				var data = msg.content.toString();
				var Djson = JSON.parse(data);
				Djson.tmstmp = new Date().toJSON();
				Djson.waitTime = wait;
				console.log(wait);
				console.log("Message Received %s", JSON.stringify(Djson));

				var options = {
					host: "localhost",
					port: "3000",
					method: "POST",
					path: "/Logs",
					headers: {
						"content-type": "application/x-www-form-urlencoded",
			    		"cache-control": "no-cache"
					}
				};

				var data = qs.stringify(Djson);
				var request = http.request(options).end(data);
			}, wait*1000);
		}, {noAck: true});

	});
});