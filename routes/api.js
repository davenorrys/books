/*
*
*
*       Complete the API routing below
*       
*       
*/

'use strict';

const expect   = require('chai').expect;
const mongoose = require('mongoose')
const Book     = require('../models/book.js')

module.exports =  (app)  =>{

  app.route('/api/books')
    .get( (req, res) =>{
      //response will be array of book objects
      //json res format: [{"_id": bookid, "title": book_title, "commentcount": num_of_comments },...]
      Book.find({}, (err, books)=>{
        res.json(books)  
      })      
    })
    
    .post( (req, res, next) =>{
      
      const book = new Book(req.body)
      book.save((err, save) =>{
        if (err) next(err.message)
        else res.json(save.toJSON())
      })
    })
    
    .delete((req, res, next) =>{
      //if successful response will be 'complete delete successful'
      Book.deleteMany({}, err =>{
        if (err) next(err)
        else res.send('complete delete successful')
      })
    });



  app.route('/api/books/:id')
    .get((req, res, next) =>{
      const bookid = req.params.id;
      //json res format: {"_id": bookid, "title": book_title, "comments": [comment,comment,...]}
      Book.findById(bookid, (err, book) =>{
        if (err) next(err.message)
        else if (book) res.json(book.toJSON())
        else res.send('no book exists')
      })
    })
    
    .post((req, res, next) =>{
      const bookid = req.params.id;
      const comment = req.body.comment;
      Book.findById(bookid, (err, book) =>{
        if (err) next(err)
        else if (book){
          book.comments.push(comment)
          book.commentcount += 1
          book.save((err, book) =>{
            if (err) next(err)
            else res.json(book.toJSON())
          })
        }
        else res.send('no book exists')
      })
    })
    
    .delete((req, res, next) =>{
      const bookid = req.params.id;
      //if successful response will be 'delete successful'
      Book.findByIdAndRemove(bookid, (err, book ) =>{
        if (err) next(err)
        else if (book) res.send('delete successful')
        else res.send('no book exists')
      })
    });
  
};
