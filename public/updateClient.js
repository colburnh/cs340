function updateClient(clientID){
    $.ajax({
        url: '/clients/' + clientID,
        type: 'PUT',
        data: $('#updateClient').serialize(),
        success: function(result){
            window.location.replace("./");
        }
    })
};
