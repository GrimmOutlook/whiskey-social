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

    // For each div with item class get whiskeyName & smallImageURL ---------------------
    $('.item').each(function(index){

      $(this).find('a').each(function(index) {

        var largeImageURL;
        var description;
        var country;
        var region;
        const whiskeyName = $(this).attr('title');
        const smallImageURL = $(this).find('.image-container img').attr('data-original');

        //Get description, country, region, largeImageURL from next page -----------------
        const redirectURL = 'https://www.thewhiskyexchange.com' + $(this).attr('href');
          request(redirectURL, function(error, response, body) {
            $ = cheerio.load(body);

            $('div#productDefaultImage').each(function(index){
              largeImageURL = $(this).find('img').attr('data-original');
            })

            $('div#prodDesc').each(function(index){
              description = $(this).text();
              // console.log(description);
            })

            $('div#prodMeta').each(function(index){
              country = $('dl.meta dd:nth-child(2)').text();
              region = $('dl.meta dd:nth-child(4)').text();
            })

            console.log('Whiskey: ' + whiskeyName + '  - Country: ' + country +', Region: ' + region + ', Description: ' + description + ', smallImageURL: ' + smallImageURL + ', largeImageURL: ' + largeImageURL);

          })  // request redirect
      })   // a each
    })  // .item each

//----- This works, but doesn't match up whiskey w/items from next page ----------------
    // $('.image-container img').each(function(index) {
    //   const imageURL = $(this).attr('data-original');
    //   const whiskeyName = $(this).attr('alt');
    //   const whiskeyObject = {name: whiskeyName, image_url: imageURL};
    //   whiskeys = JSON.stringify(whiskeyObject);
    //   // console.log(whiskeys);
    // })

    // $('.item a').each(function(index) {
    //   const redirectURL = 'https://www.thewhiskyexchange.com' + $(this).attr('href');
    //   // console.log(redirectURL);

    //     request(redirectURL, function(error, response, body) {
    //       $ = cheerio.load(body);

    //         $('div#prodDesc').each(function(index){
    //           const description = $(this).text();
    //           console.log(description);
    //         })

    //         $('div#prodMeta').each(function(index){
    //           country = $('dl.meta dd:nth-child(2)').text();
    //           region = $('dl.meta dd:nth-child(4)').text();
    //           // console.log('Country: ' + country +', Region: ' + region);
    //         })
    //     })
    // })

    // console.log('Whiskeys: ' + whiskeys + 'Country: ' + country + 'Region: ' + region);


});   // 1st request URL

app.listen(port);
console.log(`Stuff is working on Port ${port}!`);
