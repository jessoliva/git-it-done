// reference container to display issues
var issueContainerEl = document.querySelector("#issues-container");
// reference container to display message if more than 30 issues in repo
var limitWarningEl = document.querySelector("#limit-warning");
// reference header for repo name
var repoNameEl = document.querySelector("#repo-name");

// fetch issues for certain repo
var getRepoIssues = function(repo) {

  // variable that holds url displaying issues for a certain repo from a certain user
  // ?direction=asc --> sorts in ascending order / oldest to newest
  // ? after that, you input rule
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  // fetch the data
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {

        // data = issues --> sending to that function
        // pass response data to dom function
        displayIssues(data);

        // check if api has paginated issues
        // checks if there is a link available in the headers
        // This would return the value of Link, if that header exists.
        if (response.headers.get("Link")) {

          // send the repo (parameter of this function) to this function
          displayWarning(repo);
        }

      });
    }
    else {
      // if not successful, redirect to homepage
      document.location.replace("./index.html");
    }
  });
};

var getRepoName = function () {

  // assign query string to a variable
  var queryString = document.location.search;

  // get the user/repo name from the url when user inputs user name and selects a repo!
  var repoName = queryString.split("=")[1];

  // if the repo name is valid, use it
  if(repoName) {
    // display repo name on the page
    repoNameEl.textContent = repoName;


    // send the repo name to the getRepoIssues() function to get the issues for that repo!
    getRepoIssues(repoName);
  }
  // if it is not valid, redirect user to index.html
  else {
    // if no repo was given, redirect to the homepage
    document.location.replace('./index.html');
  }


}
getRepoName();

var displayIssues = function(issues) {

  // if no issues exist, display this
  if (issues.length === 0) {
    issueContainerEl.textContent = "This repo has no open issues!";
    return;
  }

  // loop through issues and create an element for each one
  for (var i = 0; i < issues.length; i++) {

    // create a link element to take users to the issue on github
    var issueEl = document.createElement("a");
    issueEl.classList = "list-item flex-row justify-space-between align-center";
    issueEl.setAttribute("href", issues[i].html_url);
    // to open link in new tab
    issueEl.setAttribute("target", "_blank");

    // create span to hold issue title
    var titleEl = document.createElement("span");
    titleEl.textContent = issues[i].title;
    //
    // append to container
    issueEl.appendChild(titleEl);

    // create a type element
    var typeEl = document.createElement("span");
    //
    // check if issue is an actual issue or a pull request
    if (issues[i].pull_request) {
    typeEl.textContent = "(Pull request)";
    } 
    else {
    typeEl.textContent = "(Issue)";
    }

    // append to container
    issueEl.appendChild(typeEl);

    // append each issue element to container
    issueContainerEl.appendChild(issueEl);
  }
};

var displayWarning = function(repo) {

  // add text to warning container
  limitWarningEl.textContent = "To see more than 30 issues, visit ";

  // create element to display link of repo if there are more than 30 issues
  var linkEl = document.createElement("a");
  linkEl.textContent = "See More Issues on GitHub.com";
  linkEl.setAttribute("href", "https://github.com/" + repo + "/issues");
  linkEl.setAttribute("target", "_blank");
  //
  // append to warning container
  limitWarningEl.appendChild(linkEl);
};
