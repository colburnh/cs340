function deleteClientPet(petID){
    $.ajax({
        url: '/clientPet/' + petID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
