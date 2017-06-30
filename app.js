var express = require("express");
var config = require("./config");
var https = require("https");
var xmljs = require("libxmljs");
var Client = require('node-rest-client').Client;
var parseJson = require('parse-json');
var json = '{\n\t"foo": true,\n}';

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
    console.log("post received.")
    res.send("slack message sent")
  });
});
app.get("/test", function(request ,res) {
  getViimaInfo(function(result) {
    res.send("slack message sent")
  });
});
// Utility functions
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
function getViimaInfo() {
  var client = new Client();
  client.get("https://app.viima.com/api/customers/1410/activities/", function (data, response) {
    console.log(data.results.length);
    var data = data.results[0]
    var slack_message = {
      text: data.fullname + " created " + data.name + " on Viima! Check it out at " + data.url,
      channel: config.slack.channel
    };
    slack.notify(slack_message, function(err, result) {
      if(err != null) {
        console.log(err, result);
      }
    });
  });
}
