import mongoose from "mongoose";
import Users from "./userModel.js";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
      },
      content: {
        type: String,
        required: true
      },
      date: {
        type: String,
        required: true, 
      },
      time: {
        type: String,
        required: true,
      },
      isComplete: {
        type: Boolean,
        default: false,
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: Users,
        required: true
      },
      createdOn:{
        type: Date, default: new Date().getTime()
    }
     
    },
    
);

const Tasks = mongoose.model('Tasks', taskSchema);
export default Tasks;