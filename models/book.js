const {Schema, model} = require('mongoose')


const bookSchema = new Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    validate: {
      validator: v => v.trim() != '',
      message: 'Title is required'
    },    
  },
  commentcount: {
    type: Number,
    default: 0
  },
  comments: [String]
})
const Book = model('Book', bookSchema)

module.exports = Book