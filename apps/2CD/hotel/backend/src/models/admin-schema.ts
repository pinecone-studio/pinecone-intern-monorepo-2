import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    email:{ 
        type: String, 
        required: true 
    },
    password: { 
        type: String, 
        required: true 
    },
    phoneNumber: { 
        type: String, 
        required: true 
    },
    role: { 
        type: String,
        enum: ['Admin', 'User'], 
        default: 'Admin'
    }
})
                                
export default mongoose.model('Admin', adminSchema)