function deletePet(petID){
    $.ajax({
        url: '/pets/' + petID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
