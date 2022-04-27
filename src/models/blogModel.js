const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId
const blogsSchema = new mongoose.Schema( {
    
    title:{
        type:String,
        required:true
    },
    body:{
        type:String,
        required:true
    },
    authorId:{
        type: ObjectId,
        required : true,
        ref:"author"
    },
    tags:[String],
    
    category:{
        type:String,
        required: true,
       
    },
    subCategory:[String], 
    createAt:Date,
    updateAt:Date,

    deletedAt: Date,
    isDeleted:{
        type:Boolean,
        default:false
    },
    publishedAt:String,
    ispublished:{
        type:Boolean,
        default:false
        }
   
}, { timestamps: true });

module.exports = mongoose.model('blogs', blogsSchema) 