var config = {};

config.app={};
config.api={};
config.slack={};

// App Settings
config.app.name = "Viima Bot";

// API Settings
config.api.port = 3000;

// Slack Settings
config.slack.username = config.app.name;
config.slack.emoji = ":no_pedestrians:";
config.slack.channel = "#viima";
config.slack.webhook_url = "https://hooks.slack.com/services/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";
config.slack.eventColor = "good";

module.exports = config;
