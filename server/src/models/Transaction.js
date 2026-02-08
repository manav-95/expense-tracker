import mongoose from 'mongoose'

const transactionSchema = new mongoose.Schema({
    amount: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    paymentMode: {
        type: String,
        enum: ['cash', 'upi'],
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    type: {
        type: String,
        enum: ['income', 'expense'],
        required: true,
    },
    note: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    }
}, { timestamps: true })

const Transaction = mongoose.model('Transaction', transactionSchema)
export default Transaction;