const mongoose = require("mongoose");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const Item = require("./items");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },

    email: {
        type: String,
        unique: true,
        required: true,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Email is invalid")
            }
        }
    },

    password: {
        type: String,
        required: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (value.toLowerCase().includes("password")) {
                throw new Error("Password cannot contain word 'password'. ")
            }
        }

    },
    token: [{
        token: {
            type: String,
            required: true
        }
    }]

}, {
    timestamps : true
});

userSchema.virtual("items", {
    ref : "Item",
    localField : "_id",
    foreignField : "owner"

});

userSchema.methods.toJSON = function(){
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;

    return userObject;
}

userSchema.methods.generateAuthToken = async function (){
    const user = this;
    const token = jwt.sign({_id: user._id.toString()}, "secrettoken");

    user.tokens = user.tokens.concat({token});
    await user.save();

    return token;
}

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });
    
    if(!user){
        throw new Error("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if(!isMatch){
        throw new Error("Password dont match")
    }

    return user;

}

// Hash the plain text password before saving;
userSchema.pre("save", async function(next){
    const user = this;

    if(user.isModified("password")){
        user.password = await bcrypt.hash(user.password, 8)
    }

    next();
    
})

//Delete user items whe user is removed
userSchema.pre("remove", async function(){
    const user = this;
    await Item.deleteMany({owner : user._id})
    next();
})

const User = mongoose.model("User", userSchema);

module.exports = User;