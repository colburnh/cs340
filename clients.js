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
    
     //Function for getting clientPet table. Currently not working.
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
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteClient.js", "searchClients.js"];
        var mysql = req.app.get('mysql');
        getClients(res, mysql, context, complete);
        getClientPet(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
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
    
    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:clientID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM clients WHERE clientID = ?";
        var inserts = [req.params.clientID];
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
    
    function getClientsWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT clients.clientID, clients.fname, clients.lname FROM clients WHERE clients.fname LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.clients = results;
            complete();
        });
    }
    
    
    /*Display all clients whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteClient.js","searchClients.js"];
        var mysql = req.app.get('mysql');
        getClientsWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('clients', context);
            }
        }
    });

    
    return router;
}();
