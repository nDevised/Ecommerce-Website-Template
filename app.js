const express = require('express'); 
const mysql = require('mysql');
const app = express(); 
const bcrypt = require('bcrypt'); // for hashing passwords

// Reference: https://www.youtube.com/watch?v=-RCnNyD0L-s
// mysql database 
var authCon = mysql.createConnection({
    host: "192.168.1.71",
    user: "root",
    password: "password",
    database: "authDB"
  });

  function initAuthDB() {
    // connect to the database (This is for testing purposes only, delete in final draft)
    // Check if the table auth exists, if it doesn't create it with column for email and password
    authCon.query(`
    CREATE TABLE IF NOT EXISTS auth (
    email VARCHAR(255) PRIMARY KEY NOT NULL,
    password VARCHAR(255) NOT NULL
    );
    `, function (err, result) {
    if (err) throw err;
    });
  
    // Check if info table exists, if it doesn't exist, create it with columns for email, first name, last name, address, country, province, city, postal code
    authCon.query(`
    CREATE TABLE IF NOT EXISTS info (
    email VARCHAR(255) PRIMARY KEY NOT NULL,
    firstname VARCHAR(255) NOT NULL,
    lastname VARCHAR(255) NOT NULL,
    country VARCHAR(255),
    province VARCHAR(255),
    city VARCHAR(255),
    address VARCHAR(255),
    postalcode VARCHAR(255)
    );
    `, function (err, result) {
    if (err) throw err;
    });
  }

initAuthDB();

app.listen(3000, () => console.log('Server ready'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false})); // allows us to access the data from the form in the request variable
app.get('/', (req, res) => {
    res.render("index.ejs", {name: "John Doe"});
});

app.get('/login', async (req, res) => {

    res.render("login.ejs");
});

app.get('/signup', async (req, res) => {

    res.render("signup.ejs");
});

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password; 
    const fname = req.body.fname;
    const lname = req.body.lname;   

    try{
        const hashedPassword = await bcrypt.hash(password, 10);
        authCon.query(`SELECT * FROM auth WHERE email = ?`, [email], async function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                res.send("Email already exists in database");
            } else {
                // Insert email and password into auth table
                authCon.query(`INSERT INTO auth (email, password) VALUES (?, ?)`, [email, hashedPassword], function (err, result) {
                    if (err) throw err;
                });
                // Insert email, first name, and last name into info table
                authCon.query(`INSERT INTO info (email, firstname, lastname) VALUES (?, ?, ?)`, [email, fname, lname], function (err, result) {
                    if (err) throw err;
                });
                res.redirect('/login');

            }
        });
    
    } catch {
        res.redirect('/signup');
    }

});