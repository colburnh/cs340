function deletePetProduct(petID, productID){
  $.ajax({
      url: '/petProduct/petID/' + petID + '/productID/' + productID,
      type: 'DELETE',
      success: function(result){
          if(result.responseText != undefined){
            alert(result.responseText)
          }
          else {
            window.location.reload(true)
          } 
      }
  })
};