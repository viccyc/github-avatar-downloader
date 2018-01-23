var request = require('request');
var secrets = require('./secrets');
var fs = require('fs');
var myArgs = process.argv.slice(2);

if (myArgs.length !== 2) {
  return console.log("The program needs the repo owner and repo name as arguments!");
}

console.log('Welcome to the GitHub Avatar Downloader!');

function getRepoContributors(repoOwner, repoName, callback) {
  var options = {
    url: "https://api.github.com/repos/" + repoOwner + "/" + repoName + "/contributors",
    headers: {
      'User-Agent': 'request',
      'Authorization': secrets.GITHUB_TOKEN
    }
  };

  request(options, function(err, res, body) {
  // parse the JSON string into an object
    var data = JSON.parse(body);
  // pass this object to the callback function
    callback(err, data);
  });
}

function downloadImageByURL(url, filePath) {
  request.get(url)
         .on('error', function (err) {
           throw err;
         })
         .on('response', function (response) {
           console.log('Downloading image...');
           console.log('Response Status Code: ', response.statusCode);
           console.log('Response Message: ', response.statusMessage);
           console.log('Response Content Type: ', response.headers['content-type']);
         })
         .on('end', function (response) {
           console.log('Download complete.');
         })
         .pipe(fs.createWriteStream(filePath));
 }

getRepoContributors(myArgs[0], myArgs[1], function(err, result) {
  console.log("Errors:", err);
  let loginAvatarUrl = {};
  // iterate over the results
  // for each avatar_url in the collection and create jpeg files with images
  result.forEach(function(objAvatar) {
    loginAvatarUrl[objAvatar['login']] = objAvatar['avatar_url'];
  });
  for (login in loginAvatarUrl) {
    downloadImageByURL(loginAvatarUrl[login], './avatars/' + login + '.jpg');
  }
});

