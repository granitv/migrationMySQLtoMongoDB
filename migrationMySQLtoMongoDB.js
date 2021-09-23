const mongoose = require('mongoose');
const express = require('express')
const mysql = require('mysql');

const db = mongoose.connection;
mongoose.connect("mongodb+srv://<user>:<password>@cluster0.7bnk7.mongodb.net/<databasename>?retryWrites=true&w=majority", { useNewUrlParser: true });

//check db connection
db.once('open', function(){
    console.log('Connected to MongoDB');
})

//check for db errors
db.on('error', function(err){
    console.log(err);
})

//create connection to local MySQL DB
const databaseName = '<databasename>';
const connection = mysql.createConnection({
    host     : 'localhost',
    user     : '<user>',
    password : '<password>',
    database : databaseName
});

connection.connect(function(err) {
    if (!err) {
        console.log('Connected to the MySQL...');
        return;
    }
});

// init app
const app = express();

app.get('/', function(req,res){
    res.sendStatus(200);
})

//Query MySQL DB
connection.query('SHOW TABLES FROM '+ databaseName, function(err,results,fields){
    if(err){throw err;}
    results.forEach(element => {
        console.log(element['Tables_in_'+databaseName])
        connection.query('select * from '+ element['Tables_in_'+databaseName], function(err,rez,fields){
            if(err){throw err;}
            rez.forEach(e => {
                db.collection(element['Tables_in_'+databaseName]).insertOne(e,function(err){
                    if(err){console.log(err);}
                });
            })
        })
    });
    console.log('Done!');
})

const port = process.env.PORT || 3030;

app.listen(port, function() {
    console.log(`Listening on port ${port}...`);
});