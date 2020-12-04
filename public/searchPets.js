function searchPetsByPetName() {
    //get the first name 
    var petNameString  = document.getElementById('petNameString').value
    //construct the URL and redirect to it
    window.location = '/pets/search/' + encodeURI(petNameString)
}
