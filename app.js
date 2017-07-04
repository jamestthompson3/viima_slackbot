var express = require("express");
var config = require("./config");
var https = require("https");
var Client = require('node-rest-client').Client;
var dotenv = require('dotenv');
var slash = require("./helpers/slash_commands");
var cron = require("./helpers/cron");

// Start cron job
cron.cron();

// Init Slack client

Slack = require("node-slackr");
slack = new Slack(config.slack.webhook_url, {
  channel: config.slack.channel,
  username: config.slack.username,
  icon_emoji: config.slack.emoji
});

// Set up server
var app = express();

app.get('/', function(request, res) {
  res.send("Hi there!")
});

app.listen(config.api.port, function() {
  console.log("listening on port" + config.api.port);
});

// Define app routes
app.post("/help", function(request, res) {
  slash.postSlackThings(function(result) {
    console.log("post received.")
  });
});
app.post("/inspire", function(request, res) {
  slash.quote();
});

app.post("/who", function(request ,res) {
  slash.about();
  });
app.post("/board", function(request, res) {
  slash.board();
  });
