function searchProductsByBrandName() {
    //get the first name 
    var brandNameString  = document.getElementById('brandNameString').value
    //construct the URL and redirect to it
    window.location = '/products/search/' + encodeURI(brandNameString)
}
