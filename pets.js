module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getHealthIssues(res, mysql, context, complete){
        mysql.pool.query("SELECT healthIssues.healthIssueID, healthIssues.healthIssue, healthIssues.species FROM healthIssues", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.healthIssues  = results;
            complete();
        });
    }
    
    function getPets(res, mysql, context, complete){
        mysql.pool.query("SELECT pets.petID, pets.petName, pets.species, pets.weight, pets.caloricGoal, healthIssues.healthIssue AS healthIssue, pets.percentCanned, pets.percentDry FROM pets INNER JOIN healthIssues ON pets.healthIssue = healthIssues.healthIssueID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pets = results;
            complete();
        });
    }
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePet.js", "searchPets.js"];
        var mysql = req.app.get('mysql');
        getPets(res, mysql, context, complete);
        getHealthIssues(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('pets', context);
            }

        }
    });
    
    /* Adds a pet, redirects to the pets page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO pets (petname, species, weight, caloricGoal, healthIssue, percentCanned, percentDry) VALUES (?,?,?,?,?,?,?)";
        var inserts = [req.body.petName, req.body.species, req.body.weight, req.body.caloricGoal, req.body.healthIssue, req.body.percentCanned, req.body.percentDry];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/pets');
            }
        });
    });
    
    /* Route to delete a pet, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:petID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM pets WHERE petID = ?";
        var inserts = [req.params.petID];
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
    
    function getPetsWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT pets.petID, pets.petName, pets.species, pets.weight, pets.caloricGoal, healthIssues.healthIssue AS healthIssue, pets.percentCanned, pets.percentDry FROM pets INNER JOIN healthIssues ON pets.healthIssue = healthIssues.healthIssueID WHERE pets.petName LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pets = results;
            complete();
        });
    }
    
    
    /*Display all pets whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePet.js","searchPets.js"];
        var mysql = req.app.get('mysql');
        getPetsWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('pets', context);
            }
        }
    });

    
    return router;
}();
