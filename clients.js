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
    
    /* Adds a client, redirects to the clients page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO clients (fname, lname) VALUES (?,?)";
        var inserts = [req.body.fname, req.body.lname];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/clients');
            }
        });
    });

    
    return router;
}();
