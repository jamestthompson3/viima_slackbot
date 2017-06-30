var express = require("express");
var bodyParser = require("body-parser");

var app = express();
var port = process.env.PORT || 3000;

app.use(bodyParser.urlencoded({extended: true}));

app.get('/', function(request, res) {
  res.status(200).send("Hi!");
});

app.listen(port, function() {
  console.log("listening on port" + port);
});

app.post("/hello", function(request, res, next) {
  var username = req.body.user_name;
  var payload = {
    text: "Hi" + username + ' , the viima bot is alive!!'
  };
  if (username != 'slackbot') {
    return res.status(200).json(payload);
  }
  else {
    return res.status(200).end();
  }
});
