const { assert } = require('chai');

const { userExists } = require('../helpers.js');

const testUsers = {
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

describe('userExists', function() {
  it('should return a user with valid email', function() {
    const user = userExists(testUsers, "user@example.com")
    const expectedOutput = "userRandomID";
    // Write your assert statement here
  });
  it('should return false if there are no valid emails', function() {
    const user = userExists(testUsers, "")
    const expectedOutput = false;
    // Write your assert statement here
  });
})



   


