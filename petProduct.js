module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getPets(res, mysql, context, complete){
        mysql.pool.query("SELECT pets.petID AS petID, pets.petName FROM pets", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.pets = results;
            complete();
        });
    }
    
    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT products.productID AS productID, products.foodName FROM products", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        });
    }
    
     //Function for getting clientPet table. Currently not working.
    function getPetProduct(res, mysql, context, complete){
        mysql.pool.query("SELECT IFNULL(petProduct.petID, 'NULL') AS petID, pets.petName, IFNULL(petProduct.productID, 'NULL') AS productID, products.foodName FROM petProduct INNER JOIN pets ON pets.petID = petProduct.petID INNER JOIN products ON products.productID = petProduct.productID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.petProduct = results;
            complete();
        });
    }
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deletePetProduct.js"];
        var mysql = req.app.get('mysql');
        getPets(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        getPetProduct(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('petProduct', context);
            }

        }
    });
    
    /* Adds a client pet relationship, redirects to the clientPet page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO petProduct (petID, productID) VALUES (?,?)";
        var inserts = [req.body.petID, req.body.productID];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/petProduct');
            }
        });
    });
    
    /* Route to delete a clientPet relationship, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/petID/:petID/productID/:productID', function(req, res){
        console.log(req.params.petID)
        console.log(req.params.petID)
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM petProduct WHERE productID = ? AND petID = ?";
        var inserts = [req.params.productID, req.params.petID];
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
