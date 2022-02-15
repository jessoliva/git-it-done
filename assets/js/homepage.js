// formSubmitHandler()
// reference form element
var userFormEl = document.querySelector("#user-form");
// reference input element
var nameInputEl = document.querySelector("#username");

// displayRepos()
// reference the div container that will display repos
var repoContainerEl = document.querySelector("#repos-container");
// reference span element to display name of github username
var repoSearchTerm = document.querySelector("#repo-search-term");

// getFeaturedRepos(language);
var languageButtonsEl = document.querySelector("#language-buttons");


// get user input for username and send it to getUserRepos function to fetch the info for that user
var formSubmitHandler = function(event) {
  // It stops the browser from performing the default action the event wants it to do. In the case of submitting a form, it prevents the browser from sending the form's input data to a URL, as we'll handle what happens with the form input data ourselves in JavaScript
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

// we've added a parameter to the getUserRepos() function and inserted the parameter into the GitHub API URL
var getUserRepos = function(user) {
  // format the github api url
  var apiUrl = "https://api.github.com/users/" + user + "/repos";

  // make a request to the url
  fetch(apiUrl)
  .then(function(response) {
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
  }) // api's way of handling network errors
  .catch(function(error) {
    // Notice this `.catch()` getting chained onto the end of the `.then()` method
    alert("Unable to connect to GitHub");
  });
}
// When we use fetch() to create a request, the request might go one of two ways: the request may find its destination URL and attempt to get the data in question, which would get returned into the .then() method; or if the request fails, that error will be sent to the .catch() method.

// get featured repos based on language
var getFeaturedRepos = function(language) {

  // format the github api url to accept a language
  var apiUrl = "https://api.github.com/search/repositories?q=" + language + "+is:featured&sort=help-wanted-issues";

  fetch(apiUrl)
  .then(function(response) {
    if (response.ok) {

      // convert response to json and display the data --> this extracts the json from the response
      response.json().then(function(data) {
        // this is the json() method's call back function which ^^

        console.log(data);

        // pass the language as a searchTerm into displyRepos
        displayRepos(data.items, language);
        // data.items are the actual repos 
      });
    } 
    // if the ok property is false, do this for error handling
    else {
      alert('Error: GitHub User Not Found');
    }
  }); // api's way of handling network errors
  // .catch(function(error) {
  //   // Notice this `.catch()` getting chained onto the end of the `.then()` method
  //   alert("Unable to connect to GitHub");
  // });
};

// function to display repos
// receives the repos = data and searchTerm = user = username
// accepts array of repository data
var displayRepos = function(repos, searchTerm) {

  // check if api returned any repos for that user
  if (repos.length === 0) {
    repoContainerEl.textContent = "No repositories found.";
    return;
  }

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
    var repoEl = document.createElement("a");
    repoEl.classList = "list-item flex-row justify-space-between align-center";
    // link another page to this container
    repoEl.setAttribute("href", "./single-repo.html?repo=" + repoName);
    // relative path from index.html

    // create a span element to hold repository name repoName
    var titleEl = document.createElement("span");
    titleEl.textContent = repoName;
    //
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
    // append to repoContainerEl
    repoEl.appendChild(statusEl);

    // append repoContainerEl to the dom
    repoContainerEl.appendChild(repoEl);
  }
};

// when you give it to the form, allows submission with pressing button AND clicking enter
// when in the form, you submit, run this function
userFormEl.addEventListener("submit", formSubmitHandler);

// function for language buttons
var buttonClickHandler = function(event) { 

  // when a language button is clicked (event.target) then get the value for data-language attribute
  // language will be the data-language value of the child button clicked!!
  var language = event.target.getAttribute("data-language");

  // make sure the value exists bc the other children can be clicked
  // send that language to the getFeaturedRepos(language);
  if (language) {
    // this is an asynchronous function
    // if it takes a while, the rest of the code can still go!
    getFeaturedRepos(language);
  
    // clear old content for the container that displays the repo
    repoContainerEl.textContent = "";
    // Even though this line comes after getFeaturedRepos(), it will always execute first, because getFeaturedRepos() is asynchronous and will take longer to get a response from GitHub's API.
  }
};

// when you click on one of the language buttons
// not adding event listeners to each button 
// event delegation!! from parent to children
// Why aren't we creating click listeners for each button? Think back to the concept of event delegation. Imagine that we had 15 language buttons instead of 3. That may add a lot of extra, repeated code. To keep the code DRY, we can delegate click handling on these elements to their parent elements.
languageButtonsEl.addEventListener("click", buttonClickHandler);