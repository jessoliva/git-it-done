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
    // ok is a property
    // when the HTTP request status code is something in the 200s, the ok prprty will be true
    if (response.ok) {
      // convert response to json and display the data
      response.json().then(function(data) {
        // sending the data for that specific user and the user input sent from formSubmitHandler
        displayRepos(data, user);
      });
    } 
    // if the ok property is false, do this
    else {
      alert("Error: GitHub User Not Found");
    }
  });
}
getUserRepos();

// reference form element
var userFormEl = document.querySelector("#user-form");
// reference input element
var nameInputEl = document.querySelector("#username");

// get user input for username and send it to getUserRepos function to fetch the info for that user
var formSubmitHandler = function(event) {
  // It stops the browser from performing the default action the event wants it to do. In the case of submitting a form, it prevents the browser from sending the form's input data to a URL, as we'll handle what happens with the form input data ourselves in JavaScript.
  event.preventDefault();
  
  // get value from input element, what the user input
  // .trim() removes spaces before or after
  var username = nameInputEl.value.trim();

  // if the username value is true 
  if (username) {
    // send the user input to the getUserRepos function, that name will be sent to displayRepos()
    getUserRepos(username);
    // to clear the input
    nameInputEl.value = "";
  } else {
    alert("Please enter a GitHub username");
  }

};

// when you give it to the form, allows submission with pressing button AND clicking enter
// when in the form, you submit, run this function
userFormEl.addEventListener("submit", formSubmitHandler);

// function to display repos
// receives the repos = data and searchTerm = user = username
// accepts array of repository data
var displayRepos = function(repos, searchTerm) {

  // reference the div container that will display repos
  var repoContainerEl = document.querySelector("#repos-container");
  // reference span element to display name of github username
  var repoSearchTerm = document.querySelector("#repo-search-term");

  // VITAL: When working with an app that displays data based on user input, we should always be sure to clear out the old content before displaying new content
  // clear old content
  repoContainerEl.textContent = "";
  // display searched username
  repoSearchTerm.textContent = searchTerm;

  // loop over repos for specific user
  for (var i = 0; i < repos.length; i++) {
    // format repo name that will be displayed in the span element
    var repoName = repos[i].owner.login + "/" + repos[i].name;

    // create a container for each repo
    var repoEl = document.createElement("div");
    repoEl.classList = "list-item flex-row justify-space-between align-center";

    // create a span element to hold repository name repoName
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
    // append to container
    repoEl.appendChild(titleEl);

    // create a status element
    var statusEl = document.createElement("span");
    statusEl.classList = "flex-row align-center";
    //
    // check if current repo has issues or not
    if (repos[i].open_issues_count > 0) {
      statusEl.innerHTML = "<i class='fas fa-times status-icon icon-danger'></i>" + repos[i].open_issues_count + " issue(s)";
    } else {
      statusEl.innerHTML = "<i class='fas fa-check-square status-icon icon-success'></i>";
    }
    //
    // append to container
    repoEl.appendChild(statusEl);

    // append container to the dom
    repoContainerEl.appendChild(repoEl);
  }
};