const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ 
  const username = users.find((user) => users.username == username)

  return !!username;
}

const authenticatedUser = (username,password)=>{ 
  const validUser = users.find((user) => users.username === username && users.password === password)

  return !!validUser;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  let username = req.body.username;
  let password = req.body.password;

  if (!username || !password){
    return res.status(404).json({"message":"body empty"});
  }

  if (authenticatedUser){
    let accessToken = jwt.sign({data: username}, 'access', {expiresIn: 60 *60});
    req.session.authorization = { accessToken, username };
    return res.status(200).json({"message":"user successfully logged in"});
  } else{
    return res.status(208).json({ message: "Invalid Login. Check username and password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let review = req.query.review;
  let isbn = req.params.isbn;

  const promise = new Promise((resolve, reject) => {
    if (books[isbn].reviews[req.session.authorizarion["username"]]){
      books[isbn].reviews[req.session.authorizarion["username"]] = review
      resolve();
    }
  });

  promise.then(() => {
    return res.status(200).send("successful operation");
  });
  
  promise.catch((err) => {
    return res.status(404).send("bad operation");
  });
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  //Write your code here
  let isbn = req.params.isbn;

  const promise = new Promise((resolve, reject) => {
    if (books[isbn].reviews[req.session.authorizarion["username"]]){
      delete books[isbn].reviews[req.session.authorizarion["username"]]
      resolve();
    }
  });

  promise.then(() => {
    return res.status(200).send("successful operation");
  });
  
  promise.catch((err) => {
    return res.status(404).send("bad operation");
  });
});
module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
