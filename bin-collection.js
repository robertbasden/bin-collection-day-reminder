const rp = require('request-promise');
const cheerio = require('cheerio');
const moment = require('moment');

let extractRegexp = /((Mon|Tue|Wed|Thu|Fri|Sat|Sun)\, (Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dev) \d{1,2}\, \d{4})/;

const getCollectionDates = function(uniqueId) {
  const options = {
    uri: `http://my.reading.gov.uk/?action=SetAddress&UniqueId=${uniqueId}`,
    jar: true,
    transform: function (body) {
      return cheerio.load(body);
    }
  }
  return rp(options).then(($) => {
    let getCollectionDate = function(str) {
      let collectionText = $('h4:contains('+ str + ')').siblings(".atPanelData").text();
      let match = extractRegexp.exec(collectionText);
      return match[1];
    }
    let nextGeneralWasteCollection = moment.utc(getCollectionDate("General Waste"), 'ddd, MMM D, YYYY', true);
    let nextRecyclingCollection = moment.utc(getCollectionDate("Recycling"), 'ddd, MMM D, YYYY', true);
    let nextGardenWasteCollection = moment.utc(getCollectionDate("Garden Waste"), 'ddd, MMM D, YYYY', true);
    return { nextGeneralWasteCollection, nextRecyclingCollection, nextGardenWasteCollection }
  });
}

module.exports ={
  getCollectionDates: getCollectionDates
}