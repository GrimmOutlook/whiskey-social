const MOCK_RECENT_UPDATES = {
  "recentPosts": [
    {
      "username": "magicwanda",
      "title": "Jack Daniel's Old No. 7",
      "image_url": "https://img.thewhiskyexchange.com/270/brbon_jac117.jpg",
      "postDate": "2016-05-18T16:00:00Z",
      "rating": 4,
      "likesCount": 0,
      "favorite": true,
      "unique": true,
      "comment": [{
        "author": "magicwanda",
        "text": "First post!  My favorite whiskey!",
        "commentDate": "2016-06-28T16:00:00Z",
        "replies": [{
          "author": "samiam",
          "text": "I would not drink this whiskey in a bar.  I would not drink this whiskey in a car",
          "replyDate": "2016-08-26T16:00:00Z"
        }]
      }]
    },
    {
      "username": "samiam",
      "title": "Early Times Old Reserve Bourbon",
      "image_url": "https://img.thewhiskyexchange.com/270/brbon_ear6.jpg",
      "postDate": "2016-03-18T16:00:00Z",
      "rating": 1,
      "likesCount": 2,
      "favorite": true,
      "unique": true,
      "comment": [{
        "author": "magicwanda",
        "text": "Does it pair well with green eggs and ham?",
        "commentDate": "2016-07-28T16:00:00Z",
        "replies": [{
          "author": "samiam",
          "text": "Yes. Yes it does.",
          "replyDate": "2016-09-26T16:00:00Z"
        }]
      }]
    },
    {
      "username": "magicwanda",
      "title": "Hudson Baby Bourbon",
      "image_url": "https://img.thewhiskyexchange.com/270/brbon_hud1.jpg",
      "postDate": "2016-05-18T16:00:00Z",
      "rating": 4,
      "likesCount": 1,
      "favorite": true,
      "unique": true,
      "comment": [{
        "author": "drinkingbuddy22",
        "text": "Not really a fan.",
        "commentDate": "2016-06-28T16:00:00Z",
        "replies": [{
          "author": "drunkguy",
          "text": "Drank a bottle yesterday.  Fair at best.",
          "replyDate": "2016-08-26T16:00:00Z"
        }]
      }]
    }
  ]
};

function getRecentUpdates(callbackFxn) {
    // we use a `setTimeout` to make this asynchronous
    // as it would be with a real AJAX call.
  setTimeout(function(){ callbackFxn(MOCK_RECENT_UPDATES)}, 1);
}

// this function stays the same when we connect
// to real API later
function displayRecentUpdates(data) {
    for (index in data.recentPosts) {
     $('ul').append(
        '<li>' +
        '<h2>' + data.recentPosts[index].title + '</h2>' +
        '<h3>' + data.recentPosts[index].username + '</h3>' +
        '<h4>Rating: ' + data.recentPosts[index].rating + '</h4>' +
        '<h4>Likes: ' + data.recentPosts[index].likesCount + '</h4>' +
        '<div class="image-container"><img src="' + data.recentPosts[index].image_url + '"></div>' +
        '</li>');
    }
}

// this function can stay the same even when we
// are connecting to real API
// Why is this fxn needed???
// function getAndDisplayStatusUpdates() {
//   getRecentStatusUpdates(displayStatusUpdates);
// }

//  on page load do this
$(function() {
  getRecentUpdates(displayRecentUpdates);
})












