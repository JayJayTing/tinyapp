const express = require("express");
const app = express();
const PORT = 8080;
const bodyParser = require("body-parser");
const bcrypt = require('bcrypt');


const {userExists, generateRandomString, getOwner} = require('./helpers');

let cookieSession = require("cookie-session");
app.use(cookieSession({
  name: 'session',
  keys: ["selin the goddess"],
}));

const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};





app.use(bodyParser.urlencoded({extended: true}));

app.set("view engine", "ejs");

const urlDatabase = {
  "b2xVn2": {longURL: "http://www.lighthouselabs.ca", userID:'aj481W' },
  "9sm5xK": {longURL: 'http://www.google.com', userID: 'aj481W'}
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
app.get("/login", (req, res)=>{
  console.log("hi");
  let user = null;
  res.render("urls_login",{user: null});
});
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls/new", (req, res) => {
  if (!req.session.user_id) {
    console.log("you are logged out, please login");
    res.redirect("/login");
  }
    
  let templateVars = {
    user: req.session.user_id,
    shortURL: req.params.shortURL,
    longURL: urlDatabase[req.params.shortURL] };
  res.render("urls_new", templateVars);
});

app.get("/urls", (req, res) => {
  let templateVars = {
      
    user: users[req.session.user_id],
    urls: urlDatabase };

      
      
      
  console.log(templateVars.user);
  res.render("urls_index", templateVars);
});


app.post("/urls", (req, res) => {
  console.log("being triggered");
  let a = generateRandomString();
  console.log(req.body.longURL);
    
  urlDatabase[a] = {};
  urlDatabase[a].longURL = req.body.longURL;
  urlDatabase[a].userID = req.session.user_id;
    

  res.redirect(`/urls/${a}`);
      
   
});


app.get('/urls/:shortURL', (req, res)=>{
    
  if (req.session.user_id === getOwner(urlDatabase, req.params.shortURL)) {

    let templateVars = {
      user : req.session.user_id,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL] };
     
    res.render("urls_show", templateVars);
  } else {
    res.status(403).send("you naughty boy");
  }

    
    
    
    
      
});


app.post("/urls/:shortURL/add", (req, res) =>{

 
  urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  

  res.redirect("/urls");
  
  
  
});
 

app.get("/u/:shortURL", (req, res) => {
   
    
  res.redirect(urlDatabase[req.params.shortURL].longURL);
});


  

app.post('/urls/:shortURL/delete', (req, res)=>{
  delete urlDatabase[req.params.shortURL];
  res.redirect("/urls");
});

app.post('/login', (req, res)=>{
  let userID = userExists(users, req.body.email);
      
  if (userID) {
    if (bcrypt.compareSync(req.body.password, users[userID].password)) {
      console.log("rescookie done");
        
      req.session.user_id = userID;
        

      res.redirect("/urls");
    } else {
      res.status(403).send("wrong");
    }
  } else {
    res.status(403).send("wrong");
  }

   
});

app.post("/logout", (req, res)=>{
    
  req.session.user_id = null;
  res.redirect("/urls");
});


app.get("/register", (req, res)=>{
  console.log("GET");
    
  res.render("urls_register", {user: null});
});
app.post("/register", (req, res)=>{
  let getEmail = req.body.email;
  let getID = req.body.id;
  let getPassword = req.body.password;
  if (getEmail === '' || getPassword === '') {
    console.log("error");
    return res.status(400).send("Error");
  }

  for (let keys in users) {
    if (users[keys].email === getEmail) {
      return res.status(400).send("email already exitsts");
    }
  }


  let rID = generateRandomString();
   
  users[rID] = {id: rID, email: req.body.email, password: bcrypt.hashSync(req.body.password, 10)};
    
    
  req.session.user_id = users[rID].id;
  res.redirect("/urls");
});

