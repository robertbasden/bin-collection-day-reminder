const moment = require('moment');
const binCollection = require('./bin-collection');
const Slack = require('slack-node');

require('dotenv').load()

const webhookUri = process.env.SLACK_WEBHOOK_URL;
const slack = new Slack();
slack.setWebhook(webhookUri);

const sendToSlack = (string) => {
  slack.webhook({
    channel: process.env.SLACK_WEBHOOK_CHANNEL,
    username: "house",
    icon_emoji: ":house:",
    text: string
  }, function () { });
}

let runCheck = (uniqueId, dateToMatch, dateString) => {

  binCollection.getCollectionDates(uniqueId).then(function(dates) {

    let matches = [];

    if(dateToMatch.isSame(dates.nextGeneralWasteCollection, 'day')) {
      matches.push('General Waste')
    }
    if(dateToMatch.isSame(dates.nextRecyclingCollection, 'day')) {
      matches.push('Recycling')
    }
    if(dateToMatch.isSame(dates.nextGardenWasteCollection, 'day')) {
      matches.push('Garden Waste')
    }
    if(matches.length > 0) {
      let matchString = matches.join(', ')
      sendToSlack(`${dateString} is bin collection day! You need to put out: ${matchString}`)
    }

  })

}

if(process.argv[2] == 'today') {
  runCheck(process.env.HOUSE_ID, moment(new Date()), 'Today')
} else if (process.argv[2] == 'tomorrow') {
  runCheck(process.env.HOUSE_ID, moment(new Date()).add(1, 'days'), 'Tomorrow')
} else {
  throw new Error("You need to specify either 'today' or 'tomorrow' to look up collection dates");
}