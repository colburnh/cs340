module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getClients(res, mysql, context, complete){
        mysql.pool.query("SELECT clients.clientID, clients.fname, clients.lname FROM clients", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.clients = results;
            complete();
        });
    }
    
    /* Function for getting clientPet table. Currently not working.
    function getClientPet(res, mysql, context, complete){
        mysql.pool.query("SELECT clientPet.clientID, clientPet.petID FROM clientPet", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.clientPet = results;
            complete();
        });
    }
    */
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        var mysql = req.app.get('mysql');
        getClients(res, mysql, context, complete);
        //getClientPet(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('clients', context);
            }

        }
    });

    
    return router;
}();
