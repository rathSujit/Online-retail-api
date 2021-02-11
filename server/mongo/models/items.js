const mongoose = require("mongoose");

const itemSchema = new mongoose.Schema({
    name : {
        type :String,
        required : true
    },

    rentPrice : {
        type : Number,
        required : true,
    },

    mfgDate : {
        type :Date,
        required :true
    },

    owner: {
        type : mongoose.Schema.Types.ObjectId,
        required :true,
        ref : "User"
    }


}, {
    timestamps :true
});

const Item = mongoose.model("Item", itemSchema);

module.exports = Item;