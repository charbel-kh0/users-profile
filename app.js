const path = require('path');

const express = require('express');

const methodOverride = require("method-override");

const app = express();


const db = require('./data/database');

app.set(path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

app.use(express.static('public'));

app.use(methodOverride("_method"));

const usersRoutes = require('./routes/users');
app.use('/', usersRoutes);

db.connectToDatabase().then(function() { 
  app.listen(3000, () => {
    console.log('working on 3000');
  }); 
}).catch(function(error) {
  console.log('failed to connect to the database!');
  console.log(error);
});