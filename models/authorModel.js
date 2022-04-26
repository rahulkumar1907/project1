const mongoose = require('mongoose');

const authorSchema = new mongoose.Schema( {
    // Write the schema content
    firstname:{
        type:String,
        require:true
    },
    lastname:{
        type:String,
        require:true
    },
	title:{
        type:String,
        enum:['Mr', 'Mrs', 'Miss']
    }, // Default balance at user registration is 100
	email:{
        type:String,
        require:true
    },
    password:{
        type:String,
        require:true
    }
}, { timestamps: true });

module.exports = mongoose.model('author', authorSchema) //users