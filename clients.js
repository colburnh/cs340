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
    
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteClient.js", "searchClients.js", "updateClient.js"];
        var mysql = req.app.get('mysql');
        getClients(res, mysql, context, complete);
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
        context.jsscripts = ["deleteClient.js","searchClients.js", "updateClient.js"];
        var mysql = req.app.get('mysql');
        getClientsWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('clients', context);
            }
        }
    });
    
    function getClient(res, mysql, context, clientID, complete){
        var sql = "SELECT clients.clientID AS clientID, clients.fname, clients.lname FROM clients WHERE clientID = ?";
        var inserts = [clientID];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.client = results[0];
            complete();
        });
    }
    
    /* Display one client for the specific purpose of updating clients */

    router.get('/:clientID', function(req, res){
        console.log(req.params.clientID)
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["updateClient.js"];
        var mysql = req.app.get('mysql');
        getClient(res, mysql, context, req.params.clientID, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('updateClient', context);
            }

        }
    });
    
    /* The URI that update data is sent to in order to update a person */

    router.put('/:clientID', function(req, res){
        var mysql = req.app.get('mysql');
        console.log(req.body)
        console.log(req.params.clientID)
        var sql = "UPDATE clients SET fname = ?, lname = ? WHERE clientID = ?";
        var inserts = [req.body.fname, req.body.lname, req.params.clientID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });

    
    return router;
}();
