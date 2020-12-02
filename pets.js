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
        var mysql = req.app.get('mysql');
        getPets(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('pets', context);
            }

        }
    });

    
    return router;
}();
