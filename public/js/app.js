  "firstName": "Don",
  "lastName": "Drinker",
  "password": "password-don",
  "username": "drunkguy",
  "email": "don@gmail.com",
  "myFriends": ["magicwanda", "drinkingbuddy22"],
  "postCount": 3,
  "uniquePostCount": 2,
  "friendCount": 2,
  "favoriteCount": 2,
  "badgeCount": 2,
  "badges": ["First Whiskey", "St. Patrick's Day"],
  "posts": [
    {
      "postID": 1,
      "title": "Jack Daniel's Old No. 7",
      "image_url": "https://img.thewhiskyexchange.com/270/brbon_jac117.jpg",
      "postDate": "2016-01-08T16:00:00Z",
      "rating": 5,
      "likesCount": 2,
      "favorite": true,
      "comment": [{
        "author": "magicwanda",
        "text": "What's up Don?",
        "commentDate": "2016-06-15T16:00:00Z",
        "replies": [{
          "author": "drunkguy",
          "text": "Not much.",
          "replyDate": "2016-08-14T16:00:00Z"
        }]
      }]
    },
    {
      "postID": 2,
      "title": "Early Times Old Reserve Bourbon",
      "image_url": "https://img.thewhiskyexchange.com/270/brbon_ear6.jpg",
      "postDate": "2016-03-17T16:00:00Z",
      "rating": 5,
      "likesCount": 0,
      "favorite": true,
      "comment": [{
        "author": "magicwanda",
        "text": "That stuff is nasty!",
        "commentDate": "2016-03-18T16:00:00Z",
        "replies": [{
          "author": "drunkguy",
          "text": "It is not!",
          "replyDate": "2016-03-19T16:00:00Z"
        }]
      }]
    },
    {
      "postID": 3,
      "title": "Jack Daniel's Old No. 7",
      "image_url": "https://img.thewhiskyexchange.com/270/brbon_jac117.jpg",
      "postDate": "2016-07-18T16:00:00Z",
      "rating": 5,
      "likesCount": 1,
      "favorite": true,
      "comment": [{
        "author": "drinkingbuddy22",
        "text": "Not really a fan.",
        "commentDate": "2016-07-28T16:00:00Z",
        "replies": [{
          "author": "drunkguy",
          "text": "What?  It's awesome!",
          "replyDate": "2016-08-01T16:00:00Z"
        }]
      }]
    }
  ]


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












