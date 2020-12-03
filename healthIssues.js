module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getHealthIssues(res, mysql, context, complete){
        mysql.pool.query("SELECT healthIssues.healthIssueID, healthIssues.healthIssue, healthIssues.species, healthIssues.recPercentCanned, healthIssues.recPercentDry FROM healthIssues", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.healthIssues = results;
            complete();
        });
    }
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteHealthIssue.js", "searchHealthIssues.js"];
        var mysql = req.app.get('mysql');
        getHealthIssues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('healthIssues', context);
            }

        }
    });
    
    
    /* Adds a health issue, redirects to the pets page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO healthIssues (healthIssue, species, recPercentCanned, recPercentDry) VALUES (?,?,?,?)";
        var inserts = [req.body.healthIssue, req.body.species, req.body.recPercentCanned, req.body.recPercentDry];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/healthIssues');
            }
        });
    });
    
    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:healthIssueID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM healthIssues WHERE healthIssueID = ?";
        var inserts = [req.params.healthIssueID];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })
    
    function getHealthIssuesWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT healthIssues.healthIssueID, healthIssues.healthIssue, healthIssues.species, healthIssues.recPercentCanned, healthIssues.recPercentDry FROM healthIssues WHERE healthIssues.healthIssue LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.healthIssues = results;
            complete();
        });
    }
    
    
    /*Display all pets whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteHealthIssue.js","searchHealthIssues.js"];
        var mysql = req.app.get('mysql');
        getHealthIssuesWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('healthIssues', context);
            }
        }
    });

    
    return router;
}();
