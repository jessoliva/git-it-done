// reference container to display issues
var issueContainerEl = document.querySelector("#issues-container");

// fetch issues for certain repo
var getRepoIssues = function(repo) {

  // variable that holds url displaying issues for a certain repo from a certain user
  var apiUrl = "https://api.github.com/repos/" + repo + "/issues?direction=asc";

  // fetch the data
  fetch(apiUrl)
  .then(function(response) {
    // request was successful
    if (response.ok) {
      response.json().then(function(data) {
        console.log(data);

        // data = issues --> sending to that function
        // pass response data to dom function
        displayIssues(data);
      });
    }
    else {
      alert("There was a problem with your request!");
    }
  });

  console.log(repo);
};

getRepoIssues("facebook/react");

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

