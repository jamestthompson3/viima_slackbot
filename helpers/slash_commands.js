var config = require("../config");
Slack = require("node-slackr");
var slack = new Slack(config.slack.webhook_url, {
  channel: config.slack.channel,
  username: config.slack.username,
  icon_emoji: config.slack.emoji
});
module.exports = {
// Slash Commands
// These functions are what the user controlls in the bot
postSlackThings: function() {
  var messages = {
    text: String()+"Hi! Thanks for using Viima bot! I can do a lot of interesting things."+"\n"
      +"I keep track of your Viima idea boards so that you can be more productive!" + "\n"
      +"`/whoareyou` to get a link to my source code." +"\n"
      +"`/inspire` for a quote to keep you working hard!" +"\n"
      +"`/board` to access the Viima idea board.",
    channel: config.slack.channel,
    attachments:[]
  };
  slack.notify(messages, function(err, result) {
    if(err !== null) {
      console.log(err, result);
    }
  })
},

quote: function () {
  var client = new Client();
  client.get("http://quotes.rest/qod.json?category=inspire", function (data, response) {
    var data = data.contents.quotes
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
    })
})
},

about: function () {
  var messages = {
    text: "https://github.com/jamestthompson3/viima_slackbot",
    channel: config.slack.channel,
    attachments: []
  };
  slack.notify(messages, function(err, result) {
    if(err !== null) {
      console.log(err, result);
    }
  })
},

board: function () {
  var messages = {
    text: "https://app.viima.com/tantapay/tutorial-board/",
    channel: config.slack.channel,
    attachments: []
  };
  slack.notify(messages, function(err, result) {
    if(err !== null) {
      console.log(err, result);
    }
  })
}
}
