var request = require('request');
var secrets = require('./secrets');

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

getRepoContributors("jquery", "jquery", function(err, result) {
  console.log("Errors:", err);
  console.log("Result:", result);
  // iterate over the results and (for now) console.log the value
  // for each avatar_url in the collection
  result.forEach(function(objAvatar) {
    console.log("---Person:", objAvatar);
  });
});

