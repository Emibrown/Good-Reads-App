import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from "bcrypt";
const Schema = mongoose.Schema;

const userSchema = new Schema({
   firstName: {
      type: String, 
      required: true
   },
   lastName: {
      type: String, 
      required: true
   },
   email: {
      type: String, 
      unique: true,
      required: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
      lowercase: true,
   },
   password: {
      type: String, 
      required: true,
      minlength: [8, 'Password must be more than 8 characters'],
      select: false,
   },
}, { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } });

userSchema.index({ email: 1 });

userSchema.pre('save', async function (next){
   // Hash the password before saving the user model
   const user = this
   if (user.isModified('password')) {
       user.password = await bcrypt.hash(user.password, 8)
   }
   next()
});

userSchema.methods.comparePassword = async function(userPassword, cb){
   return await bcrypt.compare(userPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;