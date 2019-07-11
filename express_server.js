const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");

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
}
app.use(cookieParser());

function userExists(users, email){
  for(let i in users)
  {
    if(email === users[i].email)
    {
      return i;
    }
  }
  return false;
}

function generateRandomString(){
    const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let newString = '';
    for(var a = 0; a < 6; a++){
        newString += alphabet[Math.floor(Math.random() * Math.floor(alphabet.length- 1)) +1];
        
    }
    return newString;
}


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
  console.log("hi")
  let user = null;
  res.render("urls_login",{user: null})
})
app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

  app.get("/urls/new", (req, res) => {
    if(!req.cookies.user_id){
      console.log("you are logged out, please login");
      res.redirect("/login");
    }
    
    let templateVars = {
      user: req.cookies.user_id,
      shortURL: req.params.shortURL, 
      longURL: urlDatabase[req.params.shortURL] };
    res.render("urls_new", templateVars);
  });

app.get("/urls", (req, res) => {
    let templateVars = { 
      
      user: users[req.cookies.user_id],
      urls: urlDatabase };

      //templateVars.urls.longURL = req.body.longURL
      
      
      console.log(templateVars.user);
    res.render("urls_index", templateVars);
  });


app.post("/urls", (req, res) => {
    console.log("being triggered");
    let a = generateRandomString();
    console.log(req.body.longURL);
    
    urlDatabase[a] = {};
    urlDatabase[a].longURL = req.body.longURL;
    urlDatabase[a].userID = req.cookies.user_id;
    

    res.redirect(`/urls/${a}`)
      
    //res.send('ok');         // Respond with 'Ok' (we will replace this)
  });

function getOwner(database, checkShortURL){
  for(let shortURL in database)
  {
    if(shortURL === checkShortURL ){
      return database[shortURL].userID
    }
  }
  return false;
}

  app.get('/urls/:shortURL', (req, res)=>{
    //console.log("shows");
    console.log("as;ldkfj;alskfdjalkdf "+req.cookies.user_id);
    console.log(getOwner(urlDatabase, req.params.shortURL))
    if(req.cookies.user_id === getOwner(urlDatabase, req.params.shortURL)){

      let templateVars = {
      user : req.cookies.user_id,
      shortURL: req.params.shortURL,
      longURL: urlDatabase[req.params.shortURL] };
      //urlDatabase[req.params.shortURL] = templateVars.longURL
    res.render("urls_show", templateVars);
    }else{
      res.status(403).send("you naughty boy");
    }

    
    
    
    
      
})


app.post("/urls/:shortURL/add", (req, res) =>{

 
  urlDatabase[req.params.shortURL].longURL = req.body.newURL;
  

  res.redirect("/urls");
  
  
  
  })
 

app.get("/u/:shortURL", (req, res) => {
    //req.params.shortURL
    
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  });


  

  app.post('/urls/:shortURL/delete', (req, res)=>{
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  })

  app.post('/login', (req, res)=>{
      let userID = userExists(users, req.body.email)
      
    if(userID)
    {
      if(users[userID].password === req.body.password)
      {
        console.log("rescookie done")
        res.cookie("user_id", userID);

        

        res.redirect("/urls")
      }else{
        res.status(403).send("wrong")
      }
    }else{
      res.status(403).send("wrong")
    }

    //res.redirect("/urls")
  })

  app.post("/logout", (req, res)=>{
    //console.log("loggedout")
    res.clearCookie("user_id");
    res.redirect("/urls")
  })


  app.get("/register", (req, res)=>{
    console.log("GET")
    
    res.render("urls_register", {user: null});
  })
  app.post("/register", (req, res)=>{
    let getEmail = req.body.email
    let getID = req.body.id
    let getPassword = req.body.password
    if(getEmail === ''|| getPassword ===''){
      console.log("error");
      return res.status(400).send("Error");
    }

    for(let keys in users){
      if(users[keys].email === getEmail){
        return res.status(400).send("email already exitsts")
      }
    }


    let rID = generateRandomString();
    users[rID] = {id: rID, email: req.body.email, password: req.body.password}
    
    res.cookie("user_id", users[rID].id)
    
    res.redirect("/urls")
  })

