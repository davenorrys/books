/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       
*/

const chaiHttp   = require('chai-http');
const chai       = require('chai');
const assert     = chai.assert;
const server     = require('../server');
const Book       = require('../models/book.js') 
const {ObjectID} = require('mongodb')
let testObjectID;

chai.use(chaiHttp);

suite('Functional Tests', function() {

  /*
  * ----[EXAMPLE TEST]----
  * Each test should completely test the response of the API end-point including response status code!
  */
  test('#example Test GET /api/books', function(done){
     chai.request(server)
      .get('/api/books')
      .end(function(err, res){
        assert.equal(res.status, 200);
        assert.isArray(res.body, 'response should be an array');
        if (res.body.length > 0){
          assert.property(res.body[0], 'commentcount', 'Books in array should contain commentcount');
          assert.property(res.body[0], 'title', 'Books in array should contain title');
          assert.property(res.body[0], '_id', 'Books in array should contain _id');  
        }
        
        done();
      });
  });
  /*
  * ----[END of EXAMPLE TEST]----
  */

  suite('Routing tests', function() {


    suite('POST /api/books with title => create book object/expect book object', function() {
      
      test('Test POST /api/books with title', function(done) {
        chai.request(server)
        .post('/api/books')
        .send({title: 'Teste'})
        .end((err, res)=>{
          assert.isNull(err)
          assert.isObject(res.body)
          assert.equal(res.body.title, 'Teste')
          assert.property(res.body, 'commentcount')
          testObjectID = res.body._id 
          done();  
        })
        
      });
      
      test('Test POST /api/books with no title given', function(done) {
        chai.request(server)
        .post('/api/books')
        .end((err, res)=>{
          assert.isNull(err)
          assert.isNotOk(res.body.title)
          assert.match(res.text, /Title is required/i)
        done();  
        })
        
      });
      
    });


    suite('GET /api/books => array of books', function(){
      
      test('Test GET /api/books',  function(done){
        chai.request(server)
        .get('/api/books')
        .end((err, res) =>{
          assert.isNull(err)
          assert.isArray(res.body)
          if (res.body.length > 1){
            assert.property(res.body[0], '_id')
            assert.property(res.body[0], 'title')
            assert.property(res.body[0], 'commentcount')
            assert.property(res.body[0], 'comments')
            assert.isArray(res.body[0].comments)
          }
          done();  
        })
        
      });      
      
    });


    suite('GET /api/books/[id] => book object with [id]', function(){
      
      test('Test GET /api/books/[id] with id not in db',  function(done){
        const id = new ObjectID()
        chai.request(server)        
        .get(`/api/books/${id}`)
        .end((err, res) =>{
          assert.isNull(err)
          assert.isString(res.text)
          assert.match(res.text, /no book exists/i)
          
          done()
        })
        
      });
      
      test('Test GET /api/books/[id] with valid id in db',  function(done){
        
        chai.request(server)
        .get(`/api/books/${testObjectID}`)
        .end((err, res) =>{
          assert.isNull(err)
          assert.isObject(res.body)
          assert.property(res.body, '_id')
          assert.property(res.body, 'title')
          assert.property(res.body, 'commentcount')
          assert.property(res.body, 'comments')
          assert.isArray(res.body.comments)
          done()
        })  
        
      });
      
    });


    suite('POST /api/books/[id] => add comment/expect book object with id', function(){
      
      test('Test POST /api/books/[id] with comment', function(done){
        
        chai.request(server)
        .post(`/api/books/${testObjectID}`)
        .send({comment: 'Hey chai and mocha'})
        .end((err, res) =>{
          assert.isNull(err)
          assert.isObject(res.body)
          assert.property(res.body, '_id')
          assert.property(res.body, 'title')
          assert.property(res.body, 'commentcount')
          assert.property(res.body, 'comments')
          assert.isArray(res.body.comments)
          assert.include(res.body.comments, 'Hey chai and mocha')
          Book.findByIdAndDelete(testObjectID, err =>{
            assert.isNull(err)
            done()
          }) 
        })  
        
        
      });
      
    });

  });

});
