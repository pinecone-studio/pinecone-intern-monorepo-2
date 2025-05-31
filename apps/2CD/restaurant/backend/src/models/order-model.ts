import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
    buyerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    orderNumber: {
        type: Number,
        required: true,
        unique: true,
    },
    orderPrice: {
        type: Number,
        required: true,
    },
    tableNumber: {
        type: Number,
        required: true,
    },
    foodItems: [
        {
            foodId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Food',
                required: true,
            },
            quantity: {
                type: Number,
                required: true,
            },
        },
    ],
    orderStatus: {
        type: String,
        enum: ['PENDING', 'READY', 'COMPLETED', 'IN_PROGRESS'],
        default: 'PENDING',
    },
    orderDate: {
        type: Date,
        default: Date.now,
    },
}
);

export const Order = mongoose.models.Order || mongoose.model('Order', OrderSchema);