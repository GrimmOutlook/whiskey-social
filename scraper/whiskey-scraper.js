const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const app = express();
const port = 8000;

const URL = ['https://www.thewhiskyexchange.com/c/40/single-malt-scotch-whisky?status=no&pg=46#productlist-filter', 'https://www.thewhiskyexchange.com/c/40/single-malt-scotch-whisky?status=no&pg=47#productlist-filter'];
// , 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=3#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=4#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=5#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=6#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=7#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=8#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=9#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=10#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=11#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=12#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=13#productlist-filter', 'https://www.thewhiskyexchange.com/c/34/canadian-whisky', 'https://www.thewhiskyexchange.com/c/34/canadian-whisky?pg=2#productlist-filter'];

URL.forEach(function(URL){

  request(URL, function(error, response, body) {

    if(error) {
      console.log("Error: " + error);
    }
    console.log("Status code: " + response.statusCode);

    var $ = cheerio.load(body);

      // For each div with item class get whiskeyName & smallImageURL ---------------------
      $('.item').each(function(index){

        $(this).find('a').each(function(index) {

          var largeImageURL;
          var description;
          var country;
          var region;
          const whiskeyName = $(this).attr('title').trim();
          const smallImageURL = $(this).find('.image-container img').attr('data-original');

          //Get description, country, region, largeImageURL from next page -----------------
          const redirectURL = 'https://www.thewhiskyexchange.com' + $(this).attr('href');
            request(redirectURL, function(error, response, body) {
              $ = cheerio.load(body);

              $('div#productDefaultImage').each(function(index){
                largeImageURL = $(this).find('img').attr('data-original');
              })

              $('div#prodDesc').each(function(index){
                description = $(this).text().trim();
                // console.log(description);
              })

              $('div#prodMeta').each(function(index){
                country = $('dl.meta dd:nth-child(2)').text().trim();
                region = $('dl.meta dd:nth-child(4)').text().trim();
              })

              var thisWorks = '{"whiskeyName": "' + whiskeyName + '", "country": "' + country + '", "region": "' + region + '", "description": "' + description + '", "smallImageURL": "' + smallImageURL + '", "largeImageURL": "' + largeImageURL +'"}';
              console.log(thisWorks);

              fs.appendFileSync('whiskeys.json', thisWorks);
            })  // request redirect
        })   // a each
      })  // .item each
    });   // 1st request URL
});  // URL forEach

app.listen(port);
console.log(`Stuff is working on Port ${port}!`);
