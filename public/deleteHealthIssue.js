function deleteHealthIssue(healthIssueID){
    $.ajax({
        url: '/healthIssues/' + healthIssueID,
        type: 'DELETE',
        success: function(result){
            window.location.reload(true);
        }
    })
};
