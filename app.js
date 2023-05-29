const express = require('express'); 
const mysql = require('mysql');
const app = express(); 
const bcrypt = require('bcrypt'); // for hashing passwords
app.use(express.static('public'))
function isValidEmail(email) {
    // Regular expression pattern for email validation
    var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    // Test the email against the regular expression
    return emailRegex.test(email);
  }

// Reference: https://www.youtube.com/watch?v=-RCnNyD0L-s
// mysql database 
var authCon = mysql.createConnection({
    host: "192.168.1.79",
    user: "root",
    password: "password",
    database: "authDB"
  });

  var prodCon = mysql.createConnection({
    host: "192.168.1.79",
    user: "root",
    password: "password",
    database: "productdb"
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


function initProductDB() {
prodCon.query(`
    CREATE TABLE IF NOT EXISTS products (
        id INT NOT NULL,
        name VARCHAR(45) NOT NULL,
        price FLOAT NOT NULL,
        sale_price FLOAT NOT NULL,
        thumbnail_img_loc VARCHAR(45) NOT NULL,
        PRIMARY KEY (id));
    `, function (err, result) {
    if (err) throw err;
    });
}   // end of initProductDB

initAuthDB();
initProductDB();

app.listen(3000, () => console.log('Server ready'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false})); // allows us to access the data from the form in the request variable
app.get('/', (req, res) => {
    res.render("index.ejs");
});

app.get('/login', async (req, res) => {

    res.render("login.ejs");
});

app.get('/navbar', async (req, res) => {

    try{
        const query = 'SELECT id, name, thumbnail_img_loc FROM products';
        prodCon.query(query, (error, results) => {
            if (error) throw error;
            res.render("assets/navbar.ejs", {products: results});
        });
    }catch{
        console.error('Error fetching product data:', error);
        res.status(500).send('Internal Server Error');
    }

});


app.get('/signup', async (req, res) => {

    res.render("signup.ejs");
});

app.post('/signup', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password; 
    const fname = req.body.fname;
    const lname = req.body.lname;   

    if(isValidEmail(email) == true) {
        console.log("Valid email");

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
    } else {
        console.log("Invalid email");
        res.send("Invalid email");
    }

});

app.post('/login', async (req, res) => {
    const email = req.body.email;
    const password = req.body.password; 
    if(isValidEmail(email) == true) {
        console.log("Valid email");

        authCon.query(`SELECT * FROM auth WHERE email = ?`, [email], async function (err, result) {
            if (err) throw err;
            if (result.length > 0) {
                const hashedPassword = result[0].password;
                if (await bcrypt.compare(password, hashedPassword)) {
                    // get the name of the email from the info table
                    authCon.query(`SELECT firstname FROM info WHERE email = ?`, [email], function (err, result) {
                        if (err) throw err;
                        if (result.length > 0) {
                            const name = result[0].firstname;
                            res.render("index.ejs");
                        } });
                } else {
                    res.send("Incorrect password");
                }
            } else {
                res.send("Email does not exist in database");
            }
        });
    } else {
        console.log("Invalid email");
        res.send("Invalid email");
    }
});