const express = require('express');
const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const app = express();
const port = 8000;

request('https://www.thewhiskyexchange.com/c/33/american-whiskey?filter=true#productlist-filter', function(error, response, body) {
  if(error) {
    console.log("Error: " + error);
  }
  console.log("Status code: " + response.statusCode);

  var $ = cheerio.load(body);
  // console.log(body);

    $('.image-container img').each(function(index) {
      const imageURL = $(this).attr('data-original');
      const whiskeyName = $(this).attr('alt');
      const whiskeyObject = {name: whiskeyName, image_url: imageURL};
      const whiskeys = JSON.stringify(whiskeyObject);
      // console.log(whiskeys);
    })

    $('.item a').each(function(index) {
      const redirectURL = 'https://www.thewhiskyexchange.com' + $(this).attr('href');
      // console.log(redirectURL);

        request(redirectURL, function(error, response, body) {
          $ = cheerio.load(body);

            $('div#prodDesc').each(function(index){
              const description = $(this).text();
              // console.log(description);
            })

            $('div#prodMeta').each(function(index){
              const country = $('dl.meta dd:nth-child(2)').text();
              const region = $('dl.meta dd:nth-child(4)').text();
              console.log('Country: ' + country +', Region: ' + region);
            })
        })

    })
});

app.listen(port);
console.log(`Stuff is working on Port ${port}!`);
