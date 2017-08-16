const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const app = express();
const port = 8000;

const URL = ['https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true#productlist-filter', 'https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true&pg=2#productlist-filter'];
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

          var largeImageURL1;
          var description1;
          var country1;
          var region1;
          const whiskeyName1 = $(this).attr('title').trim();
          const smallImageURL1 = $(this).find('.image-container img').attr('data-original');

          //Get description, country, region, largeImageURL from next page -----------------
          const redirectURL = 'https://www.thewhiskyexchange.com' + $(this).attr('href');
            request(redirectURL, function(error, response, body) {
              $ = cheerio.load(body);

              $('div#productDefaultImage').each(function(index){
                largeImageURL1 = $(this).find('img').attr('data-original');
              })

              $('div#prodDesc').each(function(index){
                description1 = $(this).text().trim();
                // console.log(description);
              })

              $('div#prodMeta').each(function(index){
                country1 = $('dl.meta dd:nth-child(2)').text().trim();
                region1 = $('dl.meta dd:nth-child(4)').text().trim();
              })

              // console.log(whiskeyName1);
              console.log('Whiskey: ' + whiskeyName1 + '  - Country: ' + country1 +', Region: ' + region1 + ', Description: ' + description1 + ', smallImageURL: ' + smallImageURL1 + ', largeImageURL: ' + largeImageURL1);

              // var thisWorks = {"whiskeyName": "' + whiskeyName1 + '", "country": "' + country1 + '", "region": "' + region1 + '", "description": "' + description1 + '", "smallImageURL": "' + smallImageURL1 + '", "largeImageURL": "' + largeImageURL1 +'"};

              // var jsonToFile = JSON.stringify(thisWorks);

              // const jsonToFile = JSON.stringify({whiskeyName: whiskeyName1, country: country1, region: region1, description: description1, smallImageURL: smallImageURL1, largeImageURL: largeImageURL1});

              // fs.appendFileSync('whiskeys.json', jsonToFile);

            })  // request redirect
        })   // a each
      })  // .item each
    });   // 1st request URL
});  // URL forEach

app.listen(port);
console.log(`Stuff is working on Port ${port}!`);








// 'whiskeys.json', '{"whiskeyName": "' + whiskeyName + '", "country": "' + country + '", "region": "' + region + '", "description": "' + description + '", "smallImageURL": "' + smallImageURL + '", "largeImageURL": "' + largeImageURL +'"}'
