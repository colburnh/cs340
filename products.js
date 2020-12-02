module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getProducts(res, mysql, context, complete){
        mysql.pool.query("SELECT products.healthIssue, products.forSpecies, products.brandName, products.foodName, products.foodType, products.unit, products.calPerUnit FROM products", function(error, results, fields){
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
        var mysql = req.app.get('mysql');
        getProducts(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
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
    
    return router;
}();
