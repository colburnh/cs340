function searchClientsByFname(){
    //get the first name
    var firstNameString = document.getElementById('firstNameString').value
    //construct the URL and redirect to it
    window.location = '/clients/search/'+ encodeURI(firstNameString)
}
