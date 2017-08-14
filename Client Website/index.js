var express = require("express");
var app = express();
var port = process.env.PORT || 8009

app.listen(port, function(){
	console.log("Server Running on 8009");
});

app.use(express.static('node_modules'));
app.use(express.static('views'));
app.set('view engine','ejs');

app.all('/*', function(req, res, next) { 
	res.header("Access-Control-Allow-Origin", "http://*, https://*");
	res.header("Access-Control-Allow-Headers", "X-Requested-With, Authorization, content-type, Origin, X-Requested-With, Content-Type, Accept");
	if ('OPTIONS' == req.method) {
		res.sendStatus(200);
	}
	else {
		next();
	}
});

app.get('/', function(req, resp, next){
	var data = {
		title: "Client"
	};
	resp.render('index', data);
});