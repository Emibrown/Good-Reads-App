import mongoose from 'mongoose';
const Schema = mongoose.Schema;

const bookSchema = new Schema({
   title: {
      type: String, 
      required: true
   },
   coverImage: {
      type: String, 
      required: true
   },
   bookCollection: {
      type: String,
      enum : ['Want to read','Reading','Read'],
      required: true,
      default: "Want to read"
   },
   finished: {
      type: Boolean,
      default: false
   },
   rating: {
      type: Number,
      min: 0, 
      max: 5,
      default: 0
   },
   author: {
      type: String,
      required: true
   },
   user: {
      type: String,
      required: true
   },
   addedOn: {
      type: Date, 
      default: Date.now
   },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

const Book = mongoose.model('Book', bookSchema);
export default Book;