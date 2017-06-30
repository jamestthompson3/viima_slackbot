var express = require("express");
var bodyParser = require("body-parser");
var requester = require("request");

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
  var options = {
    url: "https://hooks.slack.com/services/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",
    headers: {
      'Content-type':"application/json"
    },
    data: {'text':"Testing!"}
  };
  requester.post(options);
  console.log("it worked!")
});
