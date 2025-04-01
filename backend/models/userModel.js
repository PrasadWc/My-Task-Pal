import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true
    },
    createdOn:{
        type: Date, default: new Date().getTime()
    },
    resetOtp: {
        type: String,
        default: ""
    },
    resetOtpExpireAt: {
        type: Number,
        default: 0
    }
    

});

const Users = mongoose.model("Users", userSchema);
export default Users;