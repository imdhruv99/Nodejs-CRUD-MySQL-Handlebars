// path module
const path = require('path');
// express module
const express = require('express');
// hbs module
const hbs = require('hbs');
// body-parser middleware module
const bodyparser = require('body-parser');
// mysql driver module
const mysql = require('mysql');
const app = express();

// creating connection
const conn = mysql.createConnection({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'crud'
});

// connection to database
conn.connect((err) => {
    if(err) throw err;
    console.log('MySQL Database Connceted!');
});

// Setting Views
app.set('views', path.join(__dirname, 'views'));

// Set the engine for views
app.set('view engine', 'hbs');
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// set public folder as static folder 
app.use('/assets', express.static(__dirname + '/public'));

// Home Page API
app.get('/', (req, res) => {
    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.render('product_view', {
            results: results
        });
    });
});

// Insert Data API
app.post('/save', (req, res) => {
    let data = { product_name: req.body.product_name, product_price: req.body.product_price};
    let sql = "INSERT INTO product SET ?";
    let query = conn.query(sql, data, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Update Data API
app.post('/update', (req, res) => {
    
    let sql = "UPDATE product SET product_name = '"+ req.body.product_name +"', \
    product_price='"+req.body.product_price+"' WHERE product_id="+req.body.id;

    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

// Delete Data API
app.post('/delete', (req, res) => {
    
    let sql = "DELETE FROM product WHERE product_id = " + req.body.product_id + " ";

    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.redirect('/');
    });
});

app.listen(7500, () => {
    console.log('Server is running on 7500')
});