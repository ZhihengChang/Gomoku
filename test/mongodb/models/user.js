const mongoose = require("../../../node_modules/mongoose");
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    user_id: Number,
    username: String,
    level: Number,
    status: String,
});

const User = mongoose.model('user', UserSchema);
module.exports = User;
