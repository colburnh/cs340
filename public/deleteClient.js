function deleteClient(clientID){
    $.ajax({
        url: '/clients/' + clientID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
