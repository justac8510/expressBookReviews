const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
    let username = req.body.username;
    let password = req.body.password;

    if (password && username){
        if (!isValid(username)){
            users.put({username, password});
            return res.status(200).json({"message": "successfully logged in"});
        } else{
            return res.status(403).json({"message": "user not authenticated"});
        }
    }
    return res.status(403).json({"message": "can not log in"});


});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    let book = books
    const promise = new Promise(async (resolve, reject) => {
        if (books){
            resolve(book);
        }
    });

    promise.then((book) => {
        return res.status(200).json(book);
    })
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const promise = new Promise(async (resolve, reject) => {
        resolve(books[req.params.isbn]);
    });

    promise.then((book) => {
        return res.status(200).json(book);
    });

    promise.catch((err) => {
        return res.status(404).json({"message":"book not found"});
    });
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;

    const promise = new Promise((resolve, reject) => {
        let filter_book = Object.values(books).filter((b) => {
            return b.author === author
        });
        resolve(filter_book);
    });

    promise.then((filter_book) => {
        console.log(filter_book);
        return res.status(200).json(filter_book);
    })
    promise.catch((err) => {
        return res.status(404).json({"message":"book is not found"});
    })
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;

    const promise = new Promise((resolve, reject) => {
        let filter_book = Object.values(books).filter((b) => {
            return b.title === title
        });
        resolve(filter_book);
    });

    promise.then((filter_book) => {
        console.log(filter_book);
        return res.status(200).json(filter_book);
    })
    promise.catch((err) => {
        return res.status(404).json({"message":"book is not found"});
    })
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;

    const promise = new Promise((resolve, reject) => {
        let filter_book = Object.values(books).filter((b) => {
            return b.isbn === isbn
        });
        resolve(filter_book);
    });

    promise.then((filter_book) => {
        console.log(filter_book);
        return res.status(200).json(filter_book);
    })
    promise.catch((err) => {
        return res.status(404).json({"message":"book is not found"});
    })
});

module.exports.general = public_users;
