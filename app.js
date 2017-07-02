var express = require("express");
var config = require("./config");
var https = require("https");
var Client = require('node-rest-client').Client;
var firebase = require('firebase');

var fire_config = {
  apiKey: "AIzaSyDlVBhcGfHc3PfgKdiqoRud44AfDfvB5Dg",
  authDomain: "viimabot-c9f70.firebaseapp.com",
  databaseURL: "https://viimabot-c9f70.firebaseio.com",
  storageBucket: "viimabot-c9f70.appspot.com",
};
firebase.initializeApp(fire_config);

// Init Slack client

Slack = require("node-slackr");
slack = new Slack(config.slack.webhook_url, {
  channel: config.slack.channel,
  username: config.slack.username,
  icon_emoji: config.slack.emoji
});

var app = express();

app.get('/', function(request, res) {
  res.send("Hi there!")
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
app.post("/test", function(request, res) {
  console.log(request);
  res.send("hello");
});
app.get("/update", function(request ,res) {
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
    var data = data.results
    var id_array = data.map(function(i) {
      return i.id });
    console.log(id_array);

    // firebase.database().ref("items").once("value").then((snapshot) => {
    //     data_list = snapshot.val();
    //     for (var i = 0; i < data_list.length; i++) {
    //       console.log(data_list[i]);
    //     }
    //   });


    // for (var i = 0; i < data.length; i++) {
    //   console.log(data[i].item, data[i].model, data[i].id, data[i].name);

      // firebase.database().ref(`items/${i}`).set(
      //   data[i].id
      // );
      // console.log("firebase updated");
    // var slack_message = {
    //   text: data.fullname + " created " + data.name + " on Viima! Check it out at " + data.url,
    //   channel: config.slack.channel
    // };
    // slack.notify(slack_message, function(err, result) {
    //   if(err != null) {
    //     console.log(err, result);
    //   }
    // });
  });
}
