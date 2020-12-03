module.exports = function(){
    var express = require('express');
    var router = express.Router();


    function getHealthIssues(res, mysql, context, complete){
        mysql.pool.query("SELECT healthIssues.healthIssueID, healthIssues.healthIssue FROM healthIssues", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.healthIssues  = results;
            complete();
        });
    }
    
    
    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT products.productID, healthIssues.healthIssue, products.forSpecies, products.brandName, products.foodName, products.foodType, products.unit, products.calPerUnit FROM products INNER JOIN healthIssues ON products.healthIssue = healthIssues.healthIssueID", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        });
    }
    
    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteProduct.js", "searchProducts.js"];
        var mysql = req.app.get('mysql');
        getHealthIssues(res, mysql, context, complete);
        getProducts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('products', context);
            }

        }
    });
    
    
    /* Adds a pet, redirects to the pets page after adding */

    router.post('/', function(req, res){
        console.log(req.body)
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO products (healthIssue, forSpecies, brandName, foodName, foodType, unit, calPerUnit) VALUES (?,?,?,?,?,?,?)";
        var inserts = [req.body.healthIssue, req.body.forSpecies, req.body.brandName, req.body.foodName, req.body.foodType, req.body.unit, req.body.calPerUnit];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/products');
            }
        });
    });
    
    /* Route to delete a product, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:productID', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM products WHERE productID = ?";
        var inserts = [req.params.productID];
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
    
    function getProductsWithNameLike(req, res, mysql, context, complete) {
      //sanitize the input as well as include the % character
       var query = "SELECT products.productID, healthIssues.healthIssue, products.forSpecies, products.brandName, products.foodName, products.foodType, products.unit, products.calPerUnit FROM products INNER JOIN healthIssues ON products.healthIssue = healthIssues.healthIssueID WHERE products.brandName LIKE " + mysql.pool.escape(req.params.s + '%');
      console.log(query)

      mysql.pool.query(query, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.products = results;
            complete();
        });
    }
    
    
    /*Display all pets whose name starts with a given string. Requires web based javascript to delete users with AJAX */
    router.get('/search/:s', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["deleteProduct.js","searchProducts.js"];
        var mysql = req.app.get('mysql');
        getProductsWithNameLike(req, res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('products', context);
            }
        }
    });
    
    return router;
}();
