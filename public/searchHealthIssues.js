function searchHealthIssues() {
    //get the first name 
    var healthIssueString  = document.getElementById('healthIssueString').value
    //construct the URL and redirect to it
    window.location = '/healthIssues/search/' + encodeURI(healthIssueString)
}
