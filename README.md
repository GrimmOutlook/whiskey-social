# Whiskey Social
http://whiskey-social.herokuapp.com/

[![Build Status](https://travis-ci.org/GrimmOutlook/whiskey-social.svg?branch=master)](https://travis-ci.org/GrimmOutlook/whiskey-social)
[![GitHub last commit](https://img.shields.io/github/last-commit/google/skia.svg)]()
# Summary
Whiskey Social allows you to keep track of all the different whiskeys you've tried.  You can also rate them, keep track of your favorites, and make notes on each whiskey in your collection.

# Features

### Profile Page:
Your Profile Page shows a number for:
  - **My Posts** - The total number of whiskeys that you have tasted.
  - **My Unique Posts** - The number of different whiskeys that you have tasted.
  - **My Favorites** - The number of whiskeys you have designated as a favorite.

Just click on the number and you'll be redirected to a list of whiskeys in the corresponding category.  The list will show the name, photo, and rating of your whiskey, along with a blue-ribbon favorite designation for those you have favorited.

### Whiskey Search:
- Search the database of over 1,700 whiskeys, bourbons, and scotches from around the world.
- A short description and an image of the bottle are shown for each result.

### Add notes to each of your posted whiskeys:
- Click on any whiskey on any of the 3 'posts' pages and you'll be able to see any comments you've made associated with that whiskey, along with the ability to add other comments.

# Screenshots
#### Profile Page:
<img src="public/images/readme-profile.png" alt="Profile Page preview" width="600">

#### Posts Page:
<img src="public/images/readme-posts.png" alt="Posts Page preview" width="600">

#### My Favorites Page:
<img src="public/images/readme-favorites.png" alt="My Favorites Page preview" width="600">

#### Single Post Page:
<img src="public/images/readme-single-post.png" alt="Single Post Page preview" width="600">

#### Whiskey Search Page:
<img src="public/images/readme-search.png" alt="Whiskey Search preview" width="600">

#### Whiskey Profile Page:
<img src="public/images/readme-whiskey-profile.png" alt="Whiskey Profile preview" width="600">

#### Whiskey Post Page:
<img src="public/images/readme-whiskey-post.png" alt="Whiskey Post preview" width="600">

# Endpoints

- **/whiskey-search** - Search database for a whiskey using a user's search term.  Display any matches - GET
- **/whiskey-profile/:whiskeyId** - Display information about a particular whiskey - GET
- **/post/:whiskeyId** - Render screen that allows the user to post a whiskey. - GET
- **/post/:whiskeyId** - Add a whiskey to a user's list of whiskeys. - POST
- **/post/:userId/confirm** - Render screen that allows the user to add a whiskey to their list of favorites. - GET
- **/post/:userId/confirm** - Add a whiskey to a user's list of favorites. - POST / PUT

- **/profile** - Render screen that shows the user's profile. - GET
- **/post-history** - Render screen that shows all of the user's whiskey posts. - GET
- **/my-favorites** - Render screen that shows all of the user's whiskey posts marked as a favorite. - GET
- **/whiskeys** - Render screen that shows all of the user's unique whiskey posts (no duplicates). - GET
- **/single-post/:postId** - Render screen that shows an individual whiskey post, complete with rating, comments, and favorite designation. - GET

- **/single-post/:postId** - Allows user to add an additional comment. - POST / PUT
- **/single-post/:postId** - Allows user to delete an entire post from their list of whiskeys. - DELETE

# Tech Stack

- HTML5
- CSS3
- JavaScript / ES6
- Pug
- Node.js
- Express
- MongoDB
- Passport
- Cheerio web scraper
- Mocha & Chai
- Adobe XD
- TravisCI
- Heroku

# Coming Soon

1. Ability to add friends & see each other's posts.
2. Add comments to and reply to comments on friend's posts.
3. Add a new whiskey to the database for all users to access.
4. Earn badges for drinking certain numbers or types of whiskeys.
5. Signup / Login with an existing Twitter, Facebook, or UnTappd account.
6. Add a profile photo.
7. Free bottle of Johnnie Walker Blue delivered to you just for creating an account!

