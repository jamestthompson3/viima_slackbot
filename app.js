var express = require("express");
var config = require("./config");
var https = require("https");
var Client = require('node-rest-client').Client;
var firebase = require('firebase');
var CronJob = require('cron').CronJob;
var dotenv = require('dotenv');

// Config Firebase
var fire_config = {
  apiKey: process.env.FIREBASE,
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

// Schedule checks on Viima product board
var job = new CronJob('*/2 * * * * *',function() {
  var client = new Client();
  client.get("https://app.viima.com/api/customers/1410/activities/", function (data, response) {
    var data = data.results
    var id_array = data.map(function(i) {
      return i.id
    });


    firebase.database().ref("items").once("value").then((snapshot) => {
        prev_data = snapshot.val();
        if (prev_data.length === id_array.length) {
        }
        else if (prev_data.length > id_array.length) {
          prev_data.map(function(i) {
            if (id_array.includes(i.id) === false && i.model === "item") {
              var msg = `_${i.name}_ was deleted off Viima`
              var messages = {
                text: msg,
                channel: config.slack.channel,
                attachments:[]
              };
              slack.notify(messages, function(err, result) {
                if(err !== null) {
                  console.log(err, result);
                }
              });
            }
          });
          updateFirebase(data);
        }
        else {
          var old_ids = prev_data.map(function(i) {
            return i.id;
          });
          id_array.map(function(i) {
            if (old_ids.includes(i) === false) {
              data.map(function(ii) {
                if (ii.id == i) {
                  if (ii.model === "comment") {
                    var msg = `${ii.fullname} added a ${ii.model} on Viima! Check it out: ${ii.url}`;
                  }
                  else {
                    var msg = `${ii.fullname} added an ${ii.model} on Viima! Check it out: ${ii.url}`;
                  }
                  var messages = {
                    text: msg,
                    channel: config.slack.channel,
                    attachments:[]
                  };
                  slack.notify(messages, function(err, result) {
                    if(err !== null) {
                      console.log(err, result);
                    }
                  });
                }
              });
            }
          });
          updateFirebase(data);
        }
      });
    });
  } ,function(){console.log("cronjob finished")},true,'America/Los_Angeles');

// Define app routes
app.post("/help", function(request, res) {
  postSlackThings(function(result) {
    console.log("post received.")
  });
});
app.post("/inspire", function(request, res) {
  quote();
});
app.post("/who", function(request ,res) {
  var messages = {
    text: "https://github.com/jamestthompson3/viima_slackbot",
    channel: config.slack.channel,
    attachments: []
  };
  slack.notify(messages, function(err, result) {
    if(err !== null) {
      console.log(err, result);
    }
  });
  });
  app.post("/board", function(request, res) {
    var messages = {
      text: "https://app.viima.com/tantapay/tutorial-board/",
      channel: config.slack.channel,
      attachments: []
    };
    slack.notify(messages, function(err, result) {
      if(err !== null) {
        console.log(err, result);
      }
    });
  });

// Slash Commands
function postSlackThings(things, cb) {
  var messages = {
    text: String()+"Hi! Thanks for using Viima bot! I can do a lot of interesting things."+"\n"
      +"I keep track of your Viima idea boards so that you can be more productive!" + "\n"
      +"`/whoareyou` to see my source code." +"\n"
      +"`/inspire` for a quote to keep you working hard!" +"\n"
      +"`/board` to access the Viima idea board.",
    channel: config.slack.channel,
    attachments:[]
  };
  slack.notify(messages, function(err, result) {
    if(err !== null) {
      console.log(err, result);
    }
  });
}

function quote() {
  var client = new Client();
  client.get("http://quotes.rest/qod.json?category=inspire", function (data, response) {
    var data = data.contents.quotes
    console.log(data[0].quote);
    var msg = `${data[0].quote} \n --${data[0].author}`;
    var messages = {
      text: msg,
      channel: config.slack.channel,
      attachments:[]
    };
    slack.notify(messages, function(err, result) {
      if (err != null) {
        console.log(err, result);
      }
    });
});
}
//  Update board db
function updateFirebase (data) {
  for (var i = 0; i < data.length; i++) {

    firebase.database().ref(`items/`).set(
      data
    );
    console.log("firebase updated",[i]);
  }
}
