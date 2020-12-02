module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getHealthIssues(res, mysql, context, complete){
        mysql.pool.query("SELECT healthIssues.healthIssue, healthIssues.species, healthIssues.recPercentCanned, healthIssues.recPercentDry FROM healthIssues", function(error, results, fields){
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
        //context.jsscripts = ["deleteperson.js","filterpeople.js","searchpeople.js"];
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

    
    return router;
}();
