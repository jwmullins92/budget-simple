const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose'); // allows easier authentication building with passport and mongoose

const userSchema = new Schema({     // Stores a user
    email: {
        type: String,
        required: true,
        unique: true,
    }
})

userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', userSchema)