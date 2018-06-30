
# Bin collection day reminder

Node app to Slack me and remind me when its bin collection day. Scrapes data from the [Reading Borough Council website](http://my.reading.gov.uk)

## Setup

You need to setup a `.env` file containing some settings, that looks like this:

```
SLACK_WEBHOOK_URL="..."
SLACK_WEBHOOK_CHANNEL="..."
HOUSE_ID="..."
```

The house ID is your unique house ID from the Reading Borough Council website, you can find it by:

- Go to the [RBC MyReading page](http://my.reading.gov.uk/MyReading.aspx)
- Pop open the brower console, view AJAX requests and filter for `getdata.aspx`
- Enter your postcode
- You can check the `data` field to find your `UniqueId` matched against the `DisplayName` (which will be your house name / number)
- You might need to click through results and monitor the reequests as the data is paginated

## Running

You can either check for today or tomorrow, the idea being that you can run it each night (to check for the next day) and in the morning (to check for that day).

```
node main.js today
node main.js tomorrow
```

You will then get a message in Slack workspace / channel you specified in your config that says something like:

- "Today is bin collection day! You need to put out: General Waste"
- "Tomorrow is bin collection day! You need to put out: Recycling, Garden Waste"