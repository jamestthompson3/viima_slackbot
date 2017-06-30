var express = require("express");
var config = require("./config");
var https = require("https");
var xmljs = require("libxmljs");

// Init Slack client

Slack = require("node-slackr");
slack = new Slack(config.slack.webhook_url, {
  channel: config.slack.channel,
  username: config.slack.username,
  icon_emoji: config.slack.emoji
});

var app = express();

app.get('/', function(request, res) {
  res.status(200).send("Hi!");
});

app.listen(config.api.port, function() {
  console.log("listening on port" + config.api.port);
});

app.post("/hello", function(request, res) {
  postSlackThings(function(result) {
    res.send("slack message sent")
  });
});
function postSlackThings(things, cb) {
  var hello = "hello <!channel|channel>! I'm alive!";
  var messages = {
    text: hello,
    channel: config.slack.channel,
    attachments:[]
  };
  slack.notify(messages, function(err, result) {
    if(err !== null) {
      console.log(err, result);
    }
  });
}
