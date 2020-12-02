module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPets(res, mysql, context, complete){
        mysql.pool.query("SELECT pets.petID, pets.petName, pets.species, pets.weight, pets.caloricGoal, pets.healthIssue, pets.percentCanned, pets.percentDry FROM pets", function(error, results, fields){
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
        context.jsscripts = ["deletePet.js"];
        var mysql = req.app.get('mysql');
        getPets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
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

    
    return router;
}();
