const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const blogsSchema = new mongoose.Schema( {
    
    title:{
        type:String,
        required:true
    },
    body:{
        type:mongoose.Schema.Types.Mixed,
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

   
    isDeleted:{
        type:Boolean,
        default:false
    },
    deletedAt:{
        type: String,
        default: ""
    },
    
    ispublished:{
        type:Boolean,
        default:false
        },
  publishedAt:{
      type:String,
      default: ""
  },
    },
{ timestamps: true });

module.exports = mongoose.model('blogs', blogsSchema) 