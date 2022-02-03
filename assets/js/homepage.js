// Did this to check if the api returns what we're looking for
// var getUserRepos = function() {
//   // fetch the url 
//   fetch("https://api.github.com/users/octocat/repos").then(function(response) {
//     response.json().then(function(data) {
//       console.log(data);
//     });
//   });
// };
// getUserRepos();
// json() method returns another Promise, hence the extra then() method, whose callback function captures the actual data

// we've added a parameter to the getUserRepos() function and inserted the parameter into the GitHub API URL
var getUserRepos = function(user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
  fetch(apiUrl).then(function(response) {
    // convert response to json and display the data
    response.json().then(function(data) {
      console.log(data);
    });
  });
};
getUserRepos();