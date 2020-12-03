/*
    Uses express, dbcon for database connection, body parser to parse form data
    handlebars for HTML templates
*/

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({
        defaultLayout:'main',
        });

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', process.argv[2]);
app.set('mysql', mysql);
app.use('/clients', require('./clients.js'));
app.use('/pets', require('./pets.js'));
app.use('/products', require('./products.js'));
app.use('/healthIssues', require('./healthIssues.js'));
app.use('/', express.static('public'));


//home page
app.get('/', function(req, res){
    res.status(200).render('home', {
    });
});

//home page
app.get('/home', function(req, res){
    res.status(200).render('home', {
    });
});

//hills page
app.get('/hills', function(req, res){
    res.status(200).render('hills', {
    });
});

//rc page
app.get('/rc', function(req, res){
    res.status(200).render('rc', {
    });
});

//otc page
app.get('/products', function(req, res){
    res.status(200).render('products', {
    });
});

//add pet page
app.get('/pets', function(req, res){
    res.status(200).render('pets', {
    });
});

//add client page
app.get('/clients', function(req, res){
    res.status(200).render('clients', {
    });
});

//add health issue page
app.get('/healthIssues', function(req, res){
    res.status(200).render('healthIssues', {
    });
});


app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://localhost:' + app.get('port') + '; press Ctrl-C to terminate.');
});
