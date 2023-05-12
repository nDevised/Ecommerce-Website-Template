const express = require('express'); 
const mysql = require('mysql');
const app = express(); 
app.listen(3000, () => console.log('Server ready'));
app.set("view engine", "ejs");
app.use(express.urlencoded({extended: false})); // allows us to access the data from the form in the request variable
app.get('/', (req, res) => {
    res.render("index.ejs", {name: "John Doe"});
});

app.get('/login', (req, res) => {
    res.render("login.ejs");
});

app.get('/signup', (req, res) => {
    res.render("signup.ejs");
    const email = req.body.email;
    const password = req.body.password; 
    const fname = req.body.fname;
    const lname = req.body.lname;   

});