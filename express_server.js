const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const bodyParser = require("body-parser");

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
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/hello", (req, res) => {
    res.send("<html><body>Hello <b>World</b></body></html>\n");
  });

  app.get("/urls/new", (req, res) => {
    res.render("urls_new");
  });

app.get("/urls", (req, res) => {
    let templateVars = { urls: urlDatabase };
    res.render("urls_index", templateVars);
  });


app.post("/urls", (req, res) => {
    console.log("being triggered");
    let a = generateRandomString();
    urlDatabase[a] = req.body.longURL;
    res.redirect(`/urls/${a}`)
      
    //res.send('ok');         // Respond with 'Ok' (we will replace this)
  });
  app.get('/urls/:shortURL', (req, res)=>{
    let templateVars = {shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
    //urlDatabase[req.params.shortURL] = templateVars.longURL
    res.render("urls_show", templateVars);
})


app.post("/urls/:shortURL/add", (req, res) =>{

 
  urlDatabase[req.params.shortURL] = req.body.newURL;
  
  res.redirect("/urls");
  
  
  
  })
 

app.get("/u/:shortURL", (req, res) => {
    //req.params.shortURL
    
    res.redirect(urlDatabase[req.params.shortURL]);
  });


  

  app.post('/urls/:shortURL/delete', (req, res)=>{
    delete urlDatabase[req.params.shortURL];
    res.redirect("/urls");
  })