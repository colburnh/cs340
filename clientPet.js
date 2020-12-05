module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getClients(res, mysql, context, complete){
        mysql.pool.query("SELECT clients.clientID AS clientID, clients.fname, clients.lname FROM clients", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.clients = results;
            complete();
        });
    }
    
    function getPets(res, mysql, context, complete){
        mysql.pool.query("SELECT pets.petID AS petID, pets.petName FROM pets WHERE pets.petID NOT IN (SELECT clientPet.petID FROM clientPet)", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pets = results;
            complete();
        });
    }
    
     //Function for getting clientPet table.
    function getClientPet(res, mysql, context, complete){
        mysql.pool.query("SELECT clientPet.clientID AS clientID, CONCAT(IFNULL(clients.fname, 'NULL'), ' ', IFNULL(clients.lname, '')) AS name, IFNULL(clientPet.petID, '45') AS petID, IFNULL(pets.petName, 'NULL') AS petName FROM clientPet LEFT JOIN clients ON clients.clientID = clientPet.clientID LEFT JOIN pets ON pets.petID = clientPet.petID ORDER BY clientID ASC, petID ASC", function(error, results, fields){
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
        context.jsscripts = ["deleteClientPet.js"];
        var mysql = req.app.get('mysql');
        getClients(res, mysql, context, complete);
        getPets(res, mysql, context, complete);
        getClientPet(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('clientPet', context);
            }

        }
    });
    
    /* Adds a client pet relationship, redirects to the clientPet page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO clientPet (clientID, petID) VALUES (?,?)";
        var inserts = [req.body.clientID, req.body.petID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/clientPet');
            }
        });
    });
    
    /* Route to delete a clientPet relationship, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:petID', function(req, res){
        console.log(req.params);
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM clientPet WHERE IFNULL(petID, '45') = ?";
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
