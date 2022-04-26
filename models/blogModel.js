const mongoose = require('mongoose');
let ObjectId = mongoose.Schema.Types.ObjectId
const blogsSchema = new mongoose.Schema( {
    
    title:{
        type:String,
        required:true
    },
    body:String,
    author:{
        type: ObjectId,
        ref:"author"
    },
    tags:{
        type:Array,"default":[]
    },
    category:String,
    subCategory:{
        type:Array, type:String, "default":[]
    },
    createAt:Date,
    updateAt:Date,

    deletedAt:{
        type:Date,
        require:true
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    publishedAt:{
        type:Date,
        require:true
    },
    ispublished:{
        type:Boolean,
        default:false
        }
   
}, { timestamps: true });

module.exports = mongoose.model('blogs', blogsSchema) 