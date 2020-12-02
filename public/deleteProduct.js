function deleteProduct(productID){
    $.ajax({
        url: '/products/' + productID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
