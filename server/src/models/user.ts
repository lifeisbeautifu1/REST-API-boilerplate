import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Please provide username'],
      trim: true,
      unique: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please provide password'],
      minLength: 6,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model('User', UserSchema);

export default User;
