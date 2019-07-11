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

function getOwner(database, checkShortURL){
    for(let shortURL in database)
    {
      if(shortURL === checkShortURL ){
        return database[shortURL].userID
      }
    }
    return false;
  }

  module.exports = {userExists, generateRandomString, getOwner};